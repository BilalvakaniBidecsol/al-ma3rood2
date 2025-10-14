"use client";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import RichTextEditor from "@/components/ui/RichTextEditor";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/components/ui/QuillEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-32 bg-gray-100 animate-pulse rounded-md"></div>
  ),
});

import { useTranslation } from "react-i18next";

export const categoryFields = {
  computers: [
    {
      field: "memory",
      type: "radio",
      required: true,
      options: [
        "Under 4 GB",
        "4 to 7 GB",
        "8 to 15 GB",
        "16 to 31 GB",
        "32 GB & over",
      ],
    },
    {
      field: "hard_drive_size",
      type: "select",
      required: false,
      options: [
        "under 160 gb",
        "160 gb to 239 gb",
        "240 t0 500 gb",
        "500 to 999 gb",
        "1Tb to 1.9TB",
      ],
    },
    {
      field: "cores",
      type: "select",
      required: true,
      options: ["1", "2", "4", "6", "8", "10", "12", "14"],
    },
  ],
  "clothing & fashion": [
    {
      field: "color",
      type: "text",
      required: false,
      options: ["red", "blue", "green", "yellow"],
    },
  ],
  electronics: [
    {
      field: "size",
      type: "select",
      required: false,
      options: ["32 inch", "40 inch", "50 inch", "55 inch"],
    },
  ],
  "mobile phones": [
    {
      field: "storage",
      type: "select",
      required: false,
      options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
    },
    {
      field: "color",
      type: "text",
      required: false,
      options: ["black", "white", "silver", "red", "blue", "green", "yellow"],
    },
  ],
};

function toFieldName(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function toDisplayName(label) {
  return label
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const ItemDetail = ({ parentCategoryName }) => {
  const {
    register,
    watch,
    formState: { errors },
    control,
  } = useFormContext();
  const condition = watch("condition");
  const categoryKey = (parentCategoryName || "").toLowerCase();
  const extraFields = categoryFields[categoryKey] || [];
  const { t } = useTranslation();
  const conditions = [
    {
      key: "brand_new_unused",
      label: "Brand New / Unused – never opened or used.",
    },
    {
      key: "like_new",
      label: "Like New – opened but looks and works like new.",
    },
    {
      key: "gently_used_excellent_condition",
      label: "Gently Used / Excellent Condition – minor signs of use.",
    },
    {
      key: "good_condition",
      label: "Good Condition – visible wear but fully functional.",
    },
    {
      key: "fair_condition",
      label: "Fair Condition – heavily used but still works.",
    },
    {
      key: "for_parts_or_not_working",
      label: "For Parts or Not Working – damaged or needs repair.",
    },
  ];

  return (
    <div className="w-full max-w-[800px] px-4 md:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {" "}
        {t("Item details")}
      </h2>

      {/* Description */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("Description")}
      </label>
      <Controller
        name="description"
        control={control}
        rules={{ required: "Description is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div className="rounded-md">
            <QuillEditor
              value={value}
              onChange={onChange}
              error={error?.message}
              placeholder="Describe your item..."
            />
          </div>
        )}
      />

      {/* Condition */}
      <label className="block text-sm font-medium text-gray-700 mt-6 mb-2">
        {t("Condition")}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {conditions.map((item) => (
          <label
            key={item.key}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
          >
            <input
              type="radio"
              value={item.key}
              {...register("condition")}
              checked={condition === item.key}
              className="accent-green-500"
            />
            <span className="text-sm">{t(item.label)}</span>
          </label>
        ))}
      </div>
      {errors.condition && (
        <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
      )}

      {/* Dynamic Extra Fields */}
      {extraFields.map((field, idx) => {
        const fieldName = toFieldName(field.field);
        const label = (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {toDisplayName(field.field)}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
        );

        if (field.type === "radio") {
          return (
            <div key={fieldName} className="mt-6">
              {label}
              <div className="flex flex-wrap gap-4">
                {field.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={opt}
                      {...register(fieldName, { required: field.required })}
                      className="accent-green-500"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
              {errors[fieldName] && (
                <p className="text-red-500 text-sm mt-1">
                  {toDisplayName(field.field)} is required
                </p>
              )}
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={fieldName} className="mt-6">
              {label}
              <select
                {...register(fieldName, { required: field.required })}
                className={`w-full border rounded px-4 py-2 focus:outline-none ${
                  errors[fieldName]
                    ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:border-green-400 focus:ring"
                }`}
                defaultValue=""
              >
                <option value="" disabled>
                  {t("Select")} {toDisplayName(field.field)}
                </option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors[fieldName] && (
                <p className="text-red-500 text-sm mt-1">
                  {toDisplayName(field.field)} is required
                </p>
              )}
            </div>
          );
        }
        if (field.type === "text") {
          return (
            <div key={fieldName} className="mt-6">
              {label}
              <input
                type="text"
                {...register(fieldName, { required: field.required })}
                placeholder={`Enter ${toDisplayName(field.field)}`}
                className={`w-full border rounded px-4 py-2 focus:outline-none ${
                  errors[fieldName]
                    ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:border-green-400 focus:ring"
                }`}
              />
              {errors[fieldName] && (
                <p className="text-red-500 text-sm mt-1">
                  {toDisplayName(field.field)} is required
                </p>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default ItemDetail;
