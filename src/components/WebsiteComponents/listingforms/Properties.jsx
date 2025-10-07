"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import UploadPhotos from "./UploadPhotos";
import { categoriesApi } from "@/lib/api/category";
import { listingsApi } from "@/lib/api/listings";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import CategoryModal from "./CategoryModal";

/**
 * Zod schema for property listing
 * - title, description, category_id, property_type required
 * - images: at least 1
 * - price fields: either buy_now_price OR (start_price AND reserve_price)
 */
const propertyListingSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    condition: z.enum(["brand_new", "ready_to_move", "under_construction", "furnished", "semi_furnished", "unfurnished", "recently_renovated"]),
    description: z.string().min(1, "Description is required"),
    category_id: z.number().int().optional(),
    // property_type: z.string().min(1, "Property type is required"),
    images: z.array(z.any()).min(1, "At least one image is required"),
    // Pricing
    buy_now_price: z.string().optional().or(z.null()),
    allow_offers: z.boolean().optional(),
    start_price: z.string().optional().or(z.null()),
    reserve_price: z.string().optional().or(z.null()),
    expire_at: z.date().optional().or(z.null()),
    // Generic property detail fields will be plain strings (optional)
    address: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    floor_area: z.string().optional(),
    land_area: z.string().optional(),
    rv: z.string().optional(),
    expected_price: z.string().optional(),
    agency_ref: z.string().optional(),
  
    size: z.string().optional(),
    hide_rv: z.boolean().optional(),
    bedrooms: z.string().optional(),
    bathrooms: z.string().optional(),
    furnishing: z.string().optional(),
    plot_size: z.string().optional(),
    plot_type: z.string().optional(),
    ownership: z.string().optional(),
    land_area: z.string().optional(),
    water_supply: z.string().optional(),
    floor: z.string().optional(),
    area: z.string().optional(),
    property_type_field: z.string().optional(), // to avoid clash with top property_type
    floor_level: z.string().optional(),
    parking: z.string().optional(),
    terrace: z.string().optional(),
    room_type: z.string().optional(),
    capacity: z.string().optional(),
    covered_area: z.string().optional(),
    loading_docks: z.string().optional(),
    water_availability: z.string().optional(),
    soil_type: z.string().optional(),
  })
  .refine((data) => {
    // If buy_now_price filled -> ok
    if (data.buy_now_price && data.buy_now_price.trim() !== "") return true;
    // If both start and reserve present -> ok
    if (
      data.start_price &&
      data.start_price.trim() !== "" &&
      data.reserve_price &&
      data.reserve_price.trim() !== ""
    )
      return true;
    return false;
  }, {
    message: "Either enter Buy Now Price, or both Start Price and Reserve Price",
    path: ["buy_now_price"],
  });


// Steps
const steps = [
  { title: "Property Type & Category", key: "property-type" },
  { title: "Property Details", key: "property-details" },
  { title: "Photos", key: "photos" },
  { title: "Price & Payment", key: "price-payment" },
];



// Helper: find type object by name
// const findPropertyTypeByName = (name) => propertyTypes.find((p) => p.name === name);

const Properties = ({initialValues,
    mode="create"}) => {
        const methods = useForm({
    resolver: zodResolver(propertyListingSchema),
    defaultValues: {
      property_type: "",
      condition: "brand_new",
      category_id: undefined,
      images: [],
      allow_offers: false,
    },
    mode: "onTouched",
  });

  const { handleSubmit, setValue, watch, formState: { errors }, control, reset } = methods;

  const watchedPropertyType = watch("property_type");
  const watchedCategoryId = watch("category_id");
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryStack, setCategoryStack] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

      if (copy.hide_rv) {
  copy.hide_rv = copy.hide_rv === "true" || copy.hide_rv === true;
} else {
  copy.hide_rv = false;
}
  
    return copy
    }, [initialValues]);
  
  useEffect(() => {
      if (Object.keys(normalizedInitialValues).length > 0) {
      console.log("Reset triggered with data:", normalizedInitialValues);
      reset(normalizedInitialValues);
    }
  }, [initialValues, reset, normalizedInitialValues]);

  
  
        useEffect(() => {
          async function initCategoryForEdit() {
            if (
              mode === "edit" &&
              initialValues &&
              initialValues.category_id &&
              !selectedCategory
            ) {
              const res = await categoriesApi.getAllCategories(
                initialValues.category.parent_id, "property"
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
      const listing_type = "property"
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
    const listing_type = 'property';
    if (isModalOpen) {
      setLoadingCategories(true);
      categoriesApi
        .getAllCategories('', listing_type)
        .then((cats) => {
          setCurrentCategories(cats.data || cats); // fallback for array
          setCategoryStack([]);
        })
        .finally(() => setLoadingCategories(false));
    }
  }, [isModalOpen]);

  // Add these handlers if not already present
  const handleCategoryClick = async (cat) => {
    setLoadingCategories(true);
    try {
      const result = await categoriesApi.getAllCategories(cat.id, 'property');
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
    const result = await categoriesApi.getAllCategories(parentId, 'property');
    setCurrentCategories(result.data || result);
    setCategoryStack(newStack);
    setLoadingCategories(false);
  };




  // when property_type changes, reset detail fields for safety
  useEffect(() => {
    if (watchedPropertyType) {
      // clear common detail fields (optional)
      setValue("location", "");
      setValue("price", "");
      setValue("size", "");
      setValue("bedrooms", "");
      setValue("bathrooms", "");
      setValue("furnishing", "");
      // other fields can be cleared as needed
    }
  }, [watchedPropertyType, setValue]);

  const onSubmit = async (data) => {
    console.log(data)
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("listing_type", 'property');
      formData.append("category_id", data.category_id);
      formData.append("title", data.title || "");
      formData.append("subtitle", data.subtitle || "");
      formData.append("description", data.description || "");
      formData.append("condition", data.condition || "brand_new");
      formData.append("buy_now_price", data.buy_now_price || "");
      formData.append("allow_offers", data.allow_offers ? "1" : "0");
      formData.append("start_price", data.start_price || "");
      formData.append("reserve_price", data.reserve_price || "");

      if (data.expire_at) {
        formData.append("expire_at", data.expire_at.toISOString());
      }

      formData.append("payment_method_id", data.payment_method_id || "");
      formData.append("pickup_option", "pickup_available");

      // ✅ Property specific fields
      const propertyFields = [
        "listing_type",
        "sub_type",
        "address",
        "country",
        "city",
        "area",
        "floor_area",
        "land_area",
        "rv",
        "expected_price",
        "agency_ref",
        // "rv",
        "parking",
        "view_instructions",
        "bedrooms",
        "bathrooms",
        "hide_rv"
      ];

      let attributeIndex = 0;
      propertyFields.forEach((field) => {
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
      // toast.success("Property listing created successfully!");
      // console.log('response property', response);
           let response;
          if (mode === "edit" && initialValues.slug) {
            response = await listingsApi.updateListing(initialValues.slug, formData);
            toast.success("Property listing updated successfully!");
          } else {
            response = await listingsApi.createListing(formData);
            toast.success("Property listing created successfully!");
          }

      if (response && response.slug) {
        router.push(`/listing/viewlisting?slug=${response.slug}`);
      } else {
        router.push("/account");
      }
    } catch (error) {
      console.error("Error creating property listing:", error);
      toast.error("Failed to create property listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) setActiveStep((s) => s + 1);
  };
  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  const PropertyDetailsStep = ({ control, setIsModalOpen,
    selectedCategory,
    watch }) => {
    // Listing Categories and Subcategories
    const listingOptions = {
      sale: ["House", "Apartment", "Commercial Plot", "Agricultural Land"],
      rent: ["Flat", "Shop", "Office Space", "Portion"],
      lease: ["Warehouse", "Factory", "Farmhouse"],
      auction: ["Residential Plot", "Industrial Plot"],
    };

    // Country/City/Area Data
   const countries = {
  "Saudi Arabia": {
    Riyadh: ["Olaya", "Al Malaz", "Al Nakheel", "Diplomatic Quarter"],
    Jeddah: ["Al Hamra", "Al Rawdah", "Al Safa", "Corniche"],
    Dammam: ["Al Faisaliyah", "Al Shatea", "Al Aziziyah"],
    Khobar: ["Corniche", "Al Ulaya", "Al Rawabi"],
    Mecca: ["Ajyad", "Al Awali", "Al Shesha"],
    Medina: ["Al Haram", "Quba", "Uhud"],
  },
};

const conditionOptions = [
  { value: "", label: "Any Condition" },
  { value: "brand_new", label: "Brand New" },
  { value: "ready_to_move", label: "Ready to Move" },
  { value: "under_construction", label: "Under Construction" },
  { value: "furnished", label: "Furnished" },
  { value: "semi_furnished", label: "Semi-Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
  { value: "recently_renovated", label: "Recently Renovated" },
];


  const landAreaOptions = [
    { value: "", label: "Select Land Area" },
    { value: "100", label: "100 sqm" },
    { value: "200", label: "200 sqm" },
    { value: "300", label: "300 sqm" },
    { value: "400", label: "400 sqm" },
    { value: "500", label: "500+ sqm" },
  ];

  const parkingOptions = [
    { value: "", label: "Select Parking" },
    { value: "1", label: "1 Slot" },
    { value: "2", label: "2 Slots" },
    { value: "3", label: "3 Slots" },
    { value: "4", label: "4+ Slots" },
  ];

    // States
    const [selectedListingType, setSelectedListingType] = useState("");
    const [selectedSubType, setSelectedSubType] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");


    const cities = selectedCountry ? Object.keys(countries[selectedCountry]) : [];
    const areas =
      selectedCountry && selectedCity ? countries[selectedCountry][selectedCity] : [];

    const category_id = watch("category_id");
    // Modal open handler
    const openCategoryModal = () => setIsModalOpen(true);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Property Details</h2>
          <p className="text-lg text-gray-600">Provide details for your  {watchedPropertyType} </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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
          {/* Listing Type */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Type
            </label>
            <select
              value={selectedListingType}
              onChange={(e) => {
                setSelectedListingType(Number(e.target.value)); // number banado
                setSelectedSubType("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Type</option>
              {categories
                .filter((cat) => cat.parent_id === null) // only top-level
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>

          </div> */}

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Sub-Type
            </label>
            <select
              value={selectedSubType}
              onChange={(e) => setSelectedSubType(Number(e.target.value))}
              disabled={!selectedListingType}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Sub-Type</option>
              {categories
                .filter((cat) => cat.parent_id === selectedListingType) 
                .map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
            </select>

          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Title
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Enter listing title"
                />
              )}
            />
          </div>


          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Enter property address"
                />
              )}
            />
          </div>

      
      {/* Country */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Country
  </label>
  <Controller
    name="country"
    control={control}
    render={({ field }) => (
      <select
        {...field}
        onChange={(e) => {
          field.onChange(e); // update form state
          setValue("city", ""); // reset city when country changes
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select Country</option>
        {Object.keys(countries).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    )}
  />
</div>

{/* City */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    City
  </label>
  <Controller
    name="city"
    control={control}
    render={({ field }) => {
      const selectedCountry = watch("country"); // get current country
      const cities = selectedCountry ? Object.keys(countries[selectedCountry]) : [];

      return (
        <select
          {...field}
          disabled={!selectedCountry}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      );
    }}
  />
</div>



          {/* Area */}
          {/* <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
            <select
              disabled={!selectedCity}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Area</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div> */}

          {/* Floor Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Floor Area (sq ft)
            </label>
            <Controller
              name="floor_area"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              )}
            />
          </div>

        {/* Condition */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Condition
  </label>
  <Controller
    name="condition"
    control={control}
    render={({ field }) => (
      <select
        {...field}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      >
        {conditionOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  />
</div>


{/* Land Area */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Land Area
  </label>
  <Controller
    name="land_area"
    control={control}
    render={({ field }) => (
      <select
        {...field}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      >
        {landAreaOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  />
</div>

{/* Parking */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Parking
  </label>
  <Controller
    name="parking"
    control={control}
    render={({ field }) => (
      <select
        {...field}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      >
        {parkingOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  />
</div>

{/* Bedrooms */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Number of Bedrooms
  </label>
  <Controller
    name="bedrooms"
    control={control}
    render={({ field }) => (
      <input
        {...field}
        type="number"
        min="0"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      />
    )}
  />
</div>

{/* Bathrooms */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Number of Bathrooms
  </label>
  <Controller
    name="bathrooms"
    control={control}
    render={({ field }) => (
      <input
        {...field}
        type="number"
        min="0"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      />
    )}
  />
</div>


          {/* RV & Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rateable Value (RV)
            </label>
            <Controller
              name="rv"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Sale Price
            </label>
            <Controller
              name="expected_price"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              )}
            />
          </div>

          {/* Agency Reference */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agency Reference
            </label>
            <Controller
              name="agency_ref"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              )}
            />
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Details
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              )}
            />
          </div>


          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Water Supply
            </label>
            <Controller
              name="water_supply"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              )}
            />
          </div> */}

          <div className="md:col-span-2 flex items-center gap-2">
            <Controller
              name="hide_rv"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="checkbox"
                  checked={field.value === "true" || field.value === true}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                />
              )}
            />
            <span className="text-gray-700">Hide RV on Listing</span>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <div className="flex space-x-4">
                  <label className="flex items-center"><input type="radio" {...field} value="new" className="mr-2" /> New</label>
                  <label className="flex items-center"><input type="radio" {...field} value="used" className="mr-2" /> Used</label>
                </div>
              )}
            />
          </div> */}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {/* <Button onClick={prevStep} variant="outline" className="px-6 py-2 flex items-center">
            <IoIosArrowBack className="mr-2" />
            Back
          </Button> */}
          <Button onClick={nextStep} className="px-6 py-2 flex items-center" >
            Continue
            <IoIosArrowForward className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const PhotosStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Photos</h2>
        <p className="text-lg text-gray-600">Add photos of your {watchedPropertyType || "property"}</p>
      </div>

      <UploadPhotos
        // Expect UploadPhotos to call back and set images into form; if not, you can integrate here.
        // Example: UploadPhotos can accept a prop `onChange={(files) => setValue("images", files)}`
        onChange={(files) => setValue("images", files)}
      />

      {errors.images && <p className="text-red-600 text-sm">{errors.images.message}</p>}

      <div className="flex justify-between pt-6">
        <Button onClick={prevStep} variant="outline" className="px-6 py-2 flex items-center">
          <IoIosArrowBack className="mr-2" />
          Back
        </Button>
        <Button onClick={nextStep} className="px-6 py-2 flex items-center">
          Continue
          <IoIosArrowForward className="ml-2" />
        </Button>
      </div>
    </div>
  );

  const PricePaymentStep = () => {
    // category id is already in form via property type selector
    const categoryId = watchedCategoryId;

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Buy Now Price</label>
              <Controller
                name="buy_now_price"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Enter price"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allow Offers</label>
              <Controller
                name="allow_offers"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center">
                    <input type="checkbox" {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="mr-2" />
                    Accept offers from buyers
                  </label>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Price</label>
              <Controller
                name="start_price"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Enter start price"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reserve Price</label>
              <Controller
                name="reserve_price"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Enter reserve price"
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Additional Options</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date & Time</label>
              <Controller
                name="expire_at"
                control={control}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                    value={field.value ? toDateTimeLocalString(field.value) : ""}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                )}
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration / Notes</label>
              <Controller
                name="registration"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Any extra reference or registration info (optional)"
                  />
                )}
              />
            </div> */}
          </div>
        </div>

        {/* errors from refine show under buy_now_price (per schema) */}
        {errors.buy_now_price && <p className="text-red-600">{errors.buy_now_price.message}</p>}

        <div className="flex justify-between pt-6">
          <Button onClick={prevStep} variant="outline" className="px-6 py-2 flex items-center">
            <IoIosArrowBack className="mr-2" />
            Back
          </Button>
          <Button onClick={() => handleSubmit(onSubmit)()} className="px-6 py-2" disabled={isSubmitting}>
             {isSubmitting ? t(mode === "edit" ? "Updating..." : "Creating...") : t(mode === "edit" ? "Update Listing" : "Create Listing")}
          </Button>
        </div>
      </div>
    );
  };

  // Renders current step component
  const renderStepContent = () => {
    switch (activeStep) {
      // case 0:
      //   return <PropertyTypeSelector />;
      case 0:
        return <PropertyDetailsStep setIsModalOpen={setIsModalOpen}
          selectedCategory={selectedCategory}
          watch={watch} />;
      case 1:
        return <PhotosStep />;
      case 2:
        return <PricePaymentStep />;
      default:
        return null;
    }
  };

  console.log("Current Form Errors:", errors); 

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index <= activeStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${index <= activeStep ? "text-green-600" : "text-gray-500"}`}>
                {step.title}
              </span>
              {index < steps.length - 1 && <div className={`w-16 h-1 mx-4 ${index < activeStep ? "bg-green-500" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

export default Properties;

/* -------------------
   Helper functions
   ------------------- */
function formatLabel(key) {
  // Convert snake_case to Nice Label
  return key.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function toDateTimeLocalString(d) {
  // Accept Date or string -> produce local datetime-local compatible string 'YYYY-MM-DDTHH:mm'
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
