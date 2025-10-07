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
import { HexColorPicker } from "react-colorful";
import CategoryModal from "./CategoryModal";

const motorListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().nullable().optional(),
  category_id: z.number().optional().default(1),
  description: z.string().min(1, "Description is required"),
  condition: z.enum(["new", "used"]),
  images: z.array(z.any()).min(1, "At least one image is required"),

  buy_now_price: z.string().optional(),
  allow_offers: z.boolean().optional(),
  start_price: z.string().optional(),
  reserve_price: z.string().optional(),
  expire_at: z.date().optional(),
  payment_method_id: z.string().optional(),
  // quantity: z.number().optional(),
  // vehicle_type: z.string().min(1, "Vehicle Type is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  part: z.string().optional(),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
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
}).refine((data) => {
  // Case 1: Buy now price is filled
  if (data.buy_now_price && data.buy_now_price.trim() !== "") {
    return true;
  }

  // Case 2: Both start and reserve price are filled
  if (
    data.start_price && data.start_price.trim() !== "" &&
    data.reserve_price && data.reserve_price.trim() !== ""
  ) {
    return true;
  }

  // Otherwise fail
  return false;
}, {
  message: "Either enter Buy Now Price, or both Start Price and Reserve Price",
  path: ["buy_now_price"], // error will show under buy_now_price by default
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
const carData = [
  {
    make: "Toyota",
    models: [
      { name: "Corolla", years: [2020, 2021, 2022, 2023] },
      { name: "Camry", years: [2019, 2020, 2021, 2022] },
      { name: "RAV4", years: [2021, 2022, 2023] },
      { name: "Hilux", years: [2018, 2019, 2020, 2021] },
      { name: "Fortuner", years: [2020, 2021, 2022] },
    ],
  },
  {
    make: "Honda",
    models: [
      { name: "Civic", years: [2019, 2020, 2021, 2022] },
      { name: "Accord", years: [2020, 2021, 2022, 2023] },
      { name: "CR-V", years: [2021, 2022, 2023] },
      { name: "City", years: [2018, 2019, 2020, 2021] },
      { name: "HR-V", years: [2020, 2021, 2022] },
    ],
  },
  {
    make: "Ford",
    models: [
      { name: "F-150", years: [2019, 2020, 2021, 2022] },
      { name: "Mustang", years: [2020, 2021, 2022, 2023] },
      { name: "Explorer", years: [2018, 2019, 2020, 2021] },
      { name: "Escape", years: [2021, 2022, 2023] },
      { name: "Edge", years: [2019, 2020, 2021] },
    ],
  },
  {
    make: "BMW",
    models: [
      { name: "3 Series", years: [2019, 2020, 2021, 2022] },
      { name: "5 Series", years: [2020, 2021, 2022, 2023] },
      { name: "X3", years: [2018, 2019, 2020, 2021] },
      { name: "X5", years: [2021, 2022, 2023] },
      { name: "7 Series", years: [2019, 2020, 2021] },
    ],
  },
  {
    make: "Mercedes",
    models: [
      { name: "C-Class", years: [2019, 2020, 2021, 2022] },
      { name: "E-Class", years: [2020, 2021, 2022, 2023] },
      { name: "S-Class", years: [2018, 2019, 2020, 2021] },
      { name: "GLC", years: [2021, 2022, 2023] },
      { name: "GLE", years: [2019, 2020, 2021] },
    ],
  },
  {
    make: "Hyundai",
    models: [
      { name: "Elantra", years: [2019, 2020, 2021, 2022] },
      { name: "Sonata", years: [2020, 2021, 2022, 2023] },
      { name: "Tucson", years: [2018, 2019, 2020, 2021] },
      { name: "Santa Fe", years: [2021, 2022, 2023] },
      { name: "Creta", years: [2019, 2020, 2021] },
    ],
  },
];

const carPartsData = [
  {
    make: "Toyota",
    parts: [
      { name: "Headlight", compatibleModels: ["Corolla", "Camry"], years: [2019, 2020, 2021, 2022] },
      { name: "Bumper", compatibleModels: ["Corolla", "Hilux"], years: [2018, 2019, 2020] },
      { name: "Brake Pads", compatibleModels: ["RAV4", "Fortuner"], years: [2020, 2021, 2022] },
    ],
  },
  {
    make: "Honda",
    parts: [
      { name: "Headlight", compatibleModels: ["Civic", "Accord"], years: [2019, 2020, 2021] },
      { name: "Bumper", compatibleModels: ["City", "CR-V"], years: [2018, 2019, 2020] },
      { name: "Brake Pads", compatibleModels: ["HR-V"], years: [2020, 2021, 2022] },
    ],
  },
  {
    make: "Ford",
    parts: [
      { name: "Headlight", compatibleModels: ["F-150", "Mustang"], years: [2019, 2020, 2021] },
      { name: "Bumper", compatibleModels: ["Explorer", "Escape"], years: [2018, 2019, 2020] },
    ],
  },
];



const MotorListingForm = ({initialValues,
    mode="create"}) => {
        const methods = useForm({
    resolver: zodResolver(motorListingSchema),
    defaultValues: {},
    mode: "onTouched",
  });

  const { handleSubmit, setValue, watch, reset, formState: { errors }, control } = methods;
  const watchedVehicleType = watch("vehicle_type");
   const watchedCategoryId = watch("category_id");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryStack, setCategoryStack] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const vehicle_type =
    categoryStack.length > 0 ? categoryStack?.[0]?.name : null;


  const normalizedInitialValues = useMemo(() => {
    if (!initialValues) return {};
    
    // **Start with a deep copy of the raw data**
    const copy = { ...initialValues }; 

      Object.keys(copy).forEach((key) => {
    if (copy[key] === null) copy[key] = "";
  });
    
    // 1. Convert expire_at string to Date object
    if (copy.expire_at && typeof copy.expire_at === "string") {
      const date = new Date(copy.expire_at);
      copy.expire_at = isNaN(date.getTime()) ? null : date;
    }
    
    // 2. Convert 'allow_offers' string ("false") to boolean (false)
    if (copy.allow_offers) {
        copy.allow_offers = copy.allow_offers === "true" || copy.allow_offers === true;
    } else {
        copy.allow_offers = false;
    }
     // ✅ Car data normalization
  const selectedMake =
    carData.find(
      (brand) =>
        brand.make.toLowerCase().trim() ===
        (copy.make || "").toLowerCase().trim()
    ) || carData[0];

  const selectedModel =
    selectedMake.models.find(
      (m) =>
        m.name.toLowerCase().trim() ===
        (copy.model || "").toLowerCase().trim()
    ) || selectedMake.models[0];

  // Make sure year exists in the model years array
  const selectedYear = selectedModel.years.includes(Number(copy.year))
    ? Number(copy.year)
    : selectedModel.years[selectedModel.years.length - 1];

  return {
    ...copy,
    make: selectedMake.make,
    model: selectedModel.name,
    year: String(selectedYear),
  };
  }, [initialValues, carData]);

useEffect(() => {
    if (Object.keys(normalizedInitialValues).length > 0) {
    console.log("Reset triggered with data:", normalizedInitialValues);
    reset(normalizedInitialValues);
  }
}, [initialValues, carData, reset, normalizedInitialValues]);

useEffect(() => {
  console.log("Reset Triggered:", { initialValues, carDataLength: carData.length });
}, [initialValues, carData]);


      useEffect(() => {
        async function initCategoryForEdit() {
          if (
            mode === "edit" &&
            initialValues &&
            initialValues.category_id &&
            !selectedCategory
          ) {
            const res = await categoriesApi.getAllCategories(
              initialValues.category.parent_id, "motors"
            );
            const allCategories = res.data || res;
            const found = allCategories.find(
              (cat) => cat.id == initialValues.category.id
            );
            console.log(initialValues)
            if (found) {
              setSelectedCategory(found);
              setCategoryStack([found?.parent, found]);
            }
          }
        }
        initCategoryForEdit();
        // eslint-disable-next-line
      }, [mode, initialValues, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      const listing_type = "motors"
      try {
        const { data } = await categoriesApi.getAllCategories(null, listing_type);
        setCategories(data || []);
        console.log("Property dataaa", data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const listing_type = 'motors';
    if (isModalOpen) {
      setLoadingCategories(true);
      categoriesApi
        .getAllCategories('', listing_type)
        .then((cats) => {
          setCurrentCategories(cats.data || cats);
          setCategoryStack([]);
        })
        .finally(() => setLoadingCategories(false));
    }
  }, [isModalOpen]);

  // Add these handlers if not already present
  const handleCategoryClick = async (cat) => {
    setLoadingCategories(true);
    try {
      const result = await categoriesApi.getAllCategories(cat.id, 'motors');
      const children = result.data || result;
      if (children && children.length > 0) {
        setCategoryStack((prev) => [...prev, { id: cat.id, name: cat.name }]);
        setCurrentCategories(children);
      } else {
        setValue("category_id", cat.id);
        setSelectedCategory(cat);
        setIsModalOpen(false);
      }
    } finally {
      setLoadingCategories(false);
    }
  };
  const handleBackCategory = async () => {
    if (categoryStack.length === 0) return;
    setLoadingCategories(true);
    const newStack = [...categoryStack];
    newStack.pop();
    let parentId =
      newStack.length > 0 ? newStack[newStack.length - 1].id : undefined;
    const result = await categoriesApi.getAllCategories(parentId, 'motors');
    setCurrentCategories(result.data || result);
    setCategoryStack(newStack);
    setLoadingCategories(false);
  };

   useEffect(() => {
    if (watchedVehicleType && watchedVehicleType !== selectedVehicleType) {
      setSelectedVehicleType(watchedVehicleType);
      setValue("make", "");
      setValue("model", "");
    }
  }, [watchedVehicleType, setValue, selectedVehicleType]);
  useEffect(() => {
  console.log("🚨 Validation Errors:", errors);
}, [errors]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      // Basic fields
      formData.append("listing_type", "motors");
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle || "");
      formData.append("category_id", data.category_id || 1);
      formData.append("description", data.description);
      formData.append("condition", data.condition || "New");
      formData.append("buy_now_price", data.buy_now_price || "");
      formData.append("allow_offers", data.allow_offers ? "1" : "0");
      formData.append("start_price", data.start_price || "");
      formData.append("reserve_price", data.reserve_price || "");
      formData.append("pickup_option", "pickup_available");
      if (data.expire_at) {
        formData.append("expire_at", data.expire_at.toISOString());
      }

      formData.append("payment_method_id", data.payment_method_id || "");
      // formData.append("quantity", data.quantity || "1");

      const motorFields = [
        "vehicle_type", "make", "model", "year", "fuel_type", "transmission",
        "body_style", "odometer", "engine_size", "doors", "seats", "drive_type",
        "color", "import_history", "listing_type", "safety_rating", "vin",
        "registration", "wof_expiry", "rego_expiry", "license_plate", "allow_offers"
      ];

      let attributeIndex = 0;
      motorFields.forEach((field) => {
        const value = data[field];

        if (typeof value === "string" && value.trim() !== "") {
          formData.append(`attributes[${attributeIndex}][key]`, field);
          formData.append(`attributes[${attributeIndex}][value]`, value.trim());
          attributeIndex++;
        } else if (
          (typeof value === "number" && !isNaN(value)) ||
          (typeof value === "boolean") ||
          (value instanceof Date)
        ) {
          formData.append(`attributes[${attributeIndex}][key]`, field);
          formData.append(
            `attributes[${attributeIndex}][value]`,
            value instanceof Date ? value.toISOString() : value.toString()
          );
          attributeIndex++;
        }
      });



      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }

      // const response = await listingsApi.createListing(formData);
      // toast.success("Motor listing created successfully!");
        let response;
    if (mode === "edit" && initialValues.slug) {
      response = await listingsApi.updateListing(initialValues.slug, formData);
      toast.success("Motor listing updated successfully!");
    } else {
      response = await listingsApi.createListing(formData);
      toast.success("Motor listing created successfully!");
    }

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
        return <VehicleTypeStep setIsModalOpen={setIsModalOpen}
          selectedCategory={selectedCategory}
          watch={watch} />;
      case 1:
        return <VehicleDetailsStep  vehicle_type={vehicle_type}/>;
      case 2:
        return <PhotosStep />;
      case 3:
        return <PricePaymentStep />;
      default:
        return null;
    }
  };
  




  const VehicleTypeStep = ({ setIsModalOpen, selectedCategory, watch }) => {
 const category_id = watch("category_id");
    // Modal open handler
    const openCategoryModal = () => setIsModalOpen(true);

    return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What are you listing?</h2>
        <p className="text-lg text-gray-600">Choose the type of vehicle or part you want to sell</p>
      </div>

      {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
       {category_id && selectedCategory ? (
            <div className="flex justify-between items-center">
              <p className="text-base text-green-600 font-semibold">
                {selectedCategory?.name}
              </p>
              <button
                type="button"
                onClick={openCategoryModal}
                className="text-sm text-green-600 hover:underline"
              >
                {t("Change")}
              </button>
            </div>
          ) : (
            <div onClick={openCategoryModal} className="cursor-pointer">
              <p className="text-green-600 font-medium">
                {" "}
                {t("Choose category")}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t("We'll suggest a category based on your title, too.")}
              </p>
              {errors.category_id && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.category_id.message}
                </p>
              )}
            </div>
          )}
      {/* </div> */}

      {watchedCategoryId && (
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
  );}

  const VehicleDetailsStep = ({vehicle_type}) => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Vehicle Details</h2>
        <p className="text-lg text-gray-600">Tell us about your {vehicle_type}</p>
      </div>


  {vehicle_type === "Car parts & accessories" && (
  <div className="grid md:grid-cols-2 gap-6">
    
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Car Part Details</h3>

    
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Toyota Corolla Headlight"
            />
          )}
        />
      </div>

      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
        <Controller
          name="make"
          control={control}
          render={({ field }) => (
            <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select Brand</option>
              {carPartsData.map((b) => (
                <option key={b.make} value={b.make}>{b.make}</option>
              ))}
            </select>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Part / Accessory *</label>
        <Controller
          name="part"
          control={control}
          render={({ field }) => {
            const selectedBrand = watch("make");
            const parts = carPartsData.find((b) => b.make === selectedBrand)?.parts || [];
            return (
              <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" disabled={!selectedBrand}>
                <option value="">Select Part</option>
                {parts.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            );
          }}
        />
      </div>

      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Compatible Model *</label>
        <Controller
          name="model"
          control={control}
          render={({ field }) => {
            const selectedBrand = watch("make");
            const selectedPart = watch("part");
            const models =
              carPartsData
                .find((b) => b.make === selectedBrand)
                ?.parts.find((p) => p.name === selectedPart)?.compatibleModels || [];
            return (
              <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" disabled={!selectedPart}>
                <option value="">Select Model</option>
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            );
          }}
        />
      </div>

      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
        <Controller
          name="year"
          control={control}
          render={({ field }) => {
            const selectedBrand = watch("make");
            const selectedPart = watch("part");
            const selectedModel = watch("model");
            const years =
              carPartsData
                .find((b) => b.make === selectedBrand)
                ?.parts.find((p) => p.name === selectedPart)
                ?.years || [];
            return (
              <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" disabled={!selectedModel}>
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            );
          }}
        />
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
        <Controller
          name="condition"
          control={control}
          render={({ field }) => (
            <div className="flex space-x-4">
              <label className="flex items-center"><input type="radio" {...field} value="new" className="mr-2"/> New</label>
              <label className="flex items-center"><input type="radio" {...field} value="used" className="mr-2"/> Used</label>
            </div>
          )}
        />
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <Controller
          name="color"
          control={control}
          defaultValue="#000000"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <input type="color" value={field.value} onChange={field.onChange} className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"/>
              <input type="text" value={field.value} onChange={field.onChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="#000000"/>
            </div>
          )}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea {...field} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Describe the part in detail..."/>
          )}
        />
      </div>
    </div>
  </div>
)}

   {vehicle_type !== "Car parts & accessories" && (
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
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Brand</option>
                  {carData.map((car) => (
                    <option key={car.make} value={car.make}>
                      {car.make}
                    </option>
                  ))}
                </select>
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
              render={({ field }) => {
                const selectedBrand = watch("make"); // make select hota hai
                const models =
                  carData.find((car) => car.make === selectedBrand)?.models || [];

                return (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={!selectedBrand}
                  >
                    <option value="">Select Model</option>
                    {models.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                );
              }}
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
              render={({ field }) => {
                const selectedBrand = watch("make");
                const selectedModel = watch("model");
                const years =
                  carData
                    .find((car) => car.make === selectedBrand)
                    ?.models.find((m) => m.name === selectedModel)?.years || [];

                return (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={!selectedModel}
                  >
                    <option value="">Select Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                );
              }}
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

          {/* {watchedVehicleType === "car" && (
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
          )} */}

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
              Color *
            </label>
            <Controller
              name="color"
              control={control}
              defaultValue="#000000" // default black
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  {/* Color Picker */}
                  <input
                    type="color"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />

                  {/* Text Input for Hex Code */}
                  <input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="#ffffff"
                  />
                </div>
              )}
            />
            {errors.color && (
              <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
            )}
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
   )}

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Enter price"
                  />
                )}
              />

            </div>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
      focus:outline-none focus:ring-2 focus:ring-green-500 
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
      focus:outline-none focus:ring-2 focus:ring-green-500 
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Enter reserve price"
                    />
                  )}
                />

              </div>
            </>

          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Additional Options</h3>

            {/* <div>
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
      className="w-full px-3 py-2 border border-gray-300 rounded-md 
      focus:outline-none focus:ring-2 focus:ring-green-500
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      placeholder="1"
    />
  )}
/>

          </div> */}

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

            {watchedVehicleType !== "Car parts & accessories" && (
              <>
                {/* <div>
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
              </div> */
              }

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
  onClick={() => handleSubmit(onSubmit)()}
  className="px-6 py-2"
  disabled={isSubmitting}
>
  {isSubmitting ? t(mode === "edit" ? "Updating..." : "Creating...") : t(mode === "edit" ? "Update Listing" : "Create Listing")}
</Button>

        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= activeStep
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-600"
                }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${index <= activeStep ? "text-green-600" : "text-gray-500"
                }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${index < activeStep ? "bg-green-500" : "bg-gray-200"
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Step Content */}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
           {/* {renderStepContent()} */}

  {renderStepContent()}
   {isModalOpen && <CategoryModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              categoryStack={categoryStack}
              handleBackCategory={handleBackCategory}
              currentCategories={currentCategories}
              handleCategoryClick={handleCategoryClick}
              loadingCategories={loadingCategories}
            />}
        
        </form>
      </FormProvider>
    </div>
  );
};

export default MotorListingForm; 