import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Car, BikeIcon as Motorbike, Caravan, Sailboat, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import { toast } from "react-toastify";
import UploadPhotos from "./UploadPhotos";
import { categoriesApi } from "@/lib/api/category";
import { Image_URL } from "@/config/constants";

// Motor-specific schema
const motorListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  category_id: z.number().optional().default(1), // Default motors category
  description: z.string().min(1, "Description is required"),
  condition: z.enum(["new", "used"]),
  images: z.array(z.any()).min(1, "At least one image is required"),
  buy_now_price: z.string().optional(),
  allow_offers: z.boolean().optional(),
  start_price: z.string().optional(),
  reserve_price: z.string().optional(),
  expire_at: z.date().optional(),
  payment_method_id: z.string().optional(),
  quantity: z.number().optional(),
  
  // Motor-specific fields
  // vehicle_type: z.enum(["car", "motorbike", "caravan", "boat", "parts"]),
  vehicle_type: z.string().min(1, "Vehicle Type is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
  // pickup_option: z.string().optional(),
  body_style: z.string().optional(),
  odometer: z.string().optional(),
  engine_size: z.string().optional(),
  doors: z.string().optional(),
  seats: z.string().optional(),
  drive_type: z.string().optional(),
  color: z.string().optional(),
  import_history: z.string().optional(),
  listing_type: z.string().optional(),
  safety_rating: z.string().optional(),
  vin: z.string().optional(),
  registration: z.string().optional(),
  wof_expiry: z.string().optional(),
  rego_expiry: z.string().optional(),
});

const steps = [
  { title: "Vehicle Type & Category", key: "vehicle-type" },
  { title: "Vehicle Details", key: "vehicle-details" },
  { title: "Photos", key: "photos" },
  { title: "Price & Payment", key: "price-payment" },
];

const vehicleTypes = [
  { key: "car", name: "Car", icon: Car, description: "Cars, SUVs, Utes, Vans" },
  { key: "motorbike", name: "Motorbike", icon: Motorbike, description: "Motorcycles, Scooters" },
  { key: "caravan", name: "Caravan & Motorhome", icon: Caravan, description: "Caravans, Motorhomes, Trailers" },
  { key: "boat", name: "Boat & Marine", icon: Sailboat, description: "Boats, Yachts, Jetskis" },
  { key: "parts", name: "Parts & Accessories", icon: Wrench, description: "Car parts, Accessories" },
];

const MotorListingForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
    const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const listing_type= "motors"
      try {
        const { data } = await categoriesApi.getAllCategories(null,listing_type);
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // console.log('allCategories',categories);
  

  const methods = useForm({
    resolver: zodResolver(motorListingSchema),
    defaultValues: {
      vehicle_type: "car",
      condition: "used",
      allow_offers: false,
      category_id: 1, // Default motors category ID
      images: [],
    },
    mode: "onTouched",
  });

  const { handleSubmit, setValue, watch, formState: { errors }, control } = methods;
  const watchedVehicleType = watch("vehicle_type");

  useEffect(() => {
    if (watchedVehicleType && watchedVehicleType !== selectedVehicleType) {
      setSelectedVehicleType(watchedVehicleType);
      setValue("make", "");
      setValue("model", "");
    }
  }, [watchedVehicleType, setValue, selectedVehicleType]);

  const onSubmit = async (data) => {
    console.log(data);
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append("listing_type", "motors");
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle || "");
      formData.append("category_id", data.category_id || 1);
      formData.append("description", data.description);
      formData.append("condition", data.condition);
      formData.append("buy_now_price", data.buy_now_price || "");
      formData.append("allow_offers", data.allow_offers ? "1" : "0");
      formData.append("start_price", data.start_price || "");
      formData.append("reserve_price", data.reserve_price || "");
      formData.append("pickup_option", "pickup_available");

      
      if (data.expire_at) {
        formData.append("expire_at", data.expire_at.toISOString());
      }
      
      formData.append("payment_method_id", data.payment_method_id || "");
      formData.append("quantity", data.quantity || "1");
      
      // Motor-specific fields as attributes
      const motorFields = [
        "vehicle_type", "make", "model", "year", "fuel_type", "transmission",
        "body_style", "odometer", "engine_size", "doors", "seats", "drive_type",
        "color", "import_history", "listing_type", "safety_rating", "vin",
        "registration", "wof_expiry", "rego_expiry"
      ];
      
      let attributeIndex = 0;
      motorFields.forEach((field) => {
        if (data[field] && data[field].trim() !== "") {
          formData.append(`attributes[${attributeIndex}][key]`, field);
          formData.append(`attributes[${attributeIndex}][value]`, data[field]);
          attributeIndex++;
        }
      });
      
      // Handle images
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }

      const response = await listingsApi.createListing(formData);
      toast.success("Motor listing created successfully!");
      
      if (response && response.slug) {
        router.push(`/listing/viewlisting?slug=${response.slug}`);
      } else {
        router.push('/account');
      }
    } catch (error) {
      console.error("Error creating motor listing:", error);
      toast.error("Failed to create motor listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <VehicleTypeStep categories={categories}/>;
      case 1:
        return <VehicleDetailsStep />;
      case 2:
        return <PhotosStep />;
      case 3:
        return <PricePaymentStep />;
      default:
        return null;
    }
  };

  const VehicleTypeStep = ({ allCategories}) => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What are you listing?</h2>
        <p className="text-lg text-gray-600">Choose the type of vehicle or part you want to sell</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {vehicleTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.key}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                watchedVehicleType === type.key
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
              onClick={() => setValue("vehicle_type", type.key)}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  watchedVehicleType === type.key ? "bg-green-100" : "bg-gray-100"
                }`}>
                  <Icon className={`w-8 h-8 ${
                    watchedVehicleType === type.key ? "text-green-600" : "text-gray-600"
                  }`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
          );
        })} */}
        {categories.map((cat) => (
          
         <div
              key={cat.id}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                watchedVehicleType === cat.name
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
              onClick={() => {
  setValue("vehicle_type", cat.name),
  setValue("category_id", cat.id)
}}

            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  watchedVehicleType === cat.name ? "bg-green-100" : "bg-gray-100"
                }`}>
          {/* <img
            src={`${Image_URL}${cat.image}`}
            alt={cat.name}
            className="w-16 h-16 object-contain mb-3"
          /> */}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.description}</p>
              </div>
            </div>
      ))}
      </div>

      {watchedVehicleType && (
        <div className="text-center">
          <Button
            onClick={nextStep}
            className="px-8 py-3 text-lg flex items-center"
            disabled={!watchedVehicleType}
          >
            Continue
            <IoIosArrowForward className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );

  const VehicleDetailsStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Vehicle Details</h2>
        <p className="text-lg text-gray-600">Tell us about your {watchedVehicleType}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 2020 Toyota Corolla Hybrid"
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Make *
            </label>
            <Controller
              name="make"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Toyota"
                />
              )}
            />
            {errors.make && (
              <p className="text-red-500 text-sm mt-1">{errors.make.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Corolla"
                />
              )}
            />
            {errors.model && (
              <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 2020"
                />
              )}
            />
            {errors.year && (
              <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="new"
                      className="mr-2"
                    />
                    New
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="used"
                      className="mr-2"
                    />
                    Used
                  </label>
                </div>
              )}
            />
          </div>
{/* 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PickUp Option
            </label>
            <Controller
              name="pickup_option"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Pickup Option</option>
                  <option value="available">Available</option>
                  <option value="no_pickup">No Pickup</option>
                  <option value="must_pickup">Must Pickup</option>
                </select>
              )}
            />
          </div> */}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Additional Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type
            </label>
            <Controller
              name="fuel_type"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="LPG">LPG</option>
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmission
            </label>
            <Controller
              name="transmission"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                  <option value="Semi-Auto">Semi-Auto</option>
                </select>
              )}
            />
          </div>

          {watchedVehicleType === "car" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Style
              </label>
              <Controller
                name="body_style"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Body Style</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Ute">Ute</option>
                    <option value="Van">Van</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Wagon">Wagon</option>
                  </select>
                )}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Odometer (km)
            </label>
            <Controller
              name="odometer"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 50000"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Silver"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe your vehicle in detail..."
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          className="px-6 py-2 flex items-center"
        >
          <IoIosArrowBack className="mr-2" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="px-6 py-2 flex items-center"
        >
          Continue
          <IoIosArrowForward className="ml-2" />
        </Button>
      </div>
    </div>
  );

  const PhotosStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Photos</h2>
        <p className="text-lg text-gray-600">Add photos of your {watchedVehicleType}</p>
      </div>

      <UploadPhotos />

      <div className="flex justify-between pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          className="px-6 py-2 flex items-center"
        >
          <IoIosArrowBack className="mr-2" />
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="px-6 py-2 flex items-center"
        >
          Continue
          <IoIosArrowForward className="ml-2" />
        </Button>
      </div>
    </div>
  );

  const PricePaymentStep = () => {
    const categoryId = watch("category_id"); 
    return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Price & Payment</h2>
        <p className="text-lg text-gray-600">Set your pricing and payment options</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Pricing</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buy Now Price ($)
            </label>
            <Controller
              name="buy_now_price"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter price"
                />
              )}
            />
          </div>
{/* {categoryId == 5752 && ( */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allow Offers
            </label>
            <Controller
              name="allow_offers"
              control={control}
              render={({ field }) => (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mr-2"
                  />
                  Accept offers from buyers
                </label>
              )}
            />
          </div>
{/* )} */}
          {watch("allow_offers") && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Price ($)
                </label>
                <Controller
                  name="start_price"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter start price"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reserve Price ($)
                </label>
                <Controller
                  name="reserve_price"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter reserve price"
                    />
                  )}
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Additional Options</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="1"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date & Time
            </label>
            <Controller
              name="expire_at"
              control={control}
              render={({ field }) => (
                <input
                  type="datetime-local"
                  {...field}
                  value={field.value ? field.value.toISOString().slice(0, 16) : ''}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
            />
          </div>

          {watchedVehicleType !== "parts" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN Number
                </label>
                <Controller
                  name="vin"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Vehicle Identification Number"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration
                </label>
                <Controller
                  name="registration"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="License plate number"
                    />
                  )}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          className="px-6 py-2 flex items-center"
        >
          <IoIosArrowBack className="mr-2" />
          Back
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="px-6 py-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Listing"}
        </Button>
      </div>
    </div>
  )}

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= activeStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                index <= activeStep ? "text-green-600" : "text-gray-500"
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${
                  index < activeStep ? "bg-green-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {renderStepContent()}
        </form>
      </FormProvider>
    </div>
  );
};

export default MotorListingForm; 