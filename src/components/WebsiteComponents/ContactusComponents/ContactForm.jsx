"use client";
import React, { useEffect, useState } from "react";
import InputField from "../ReuseableComponenets/InputField";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { userApi } from "@/lib/api/user";
import { Country, City, State } from "country-state-city";
import Select from "react-select";
import { useAuthStore } from "@/lib/stores/authStore";

const ContactForm = () => {
  const { t } = useTranslation();
   const { user } = useAuthStore();
  const [category, setCategory] = useState("Account");
  const [helpWith, setHelpWith] = useState("Emails");
  const [option, setOption] = useState("trouble receiving Ma3rood emails");

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^[0-9]{10,15}$/, "Phone number must be 10 to 15 digits only")

      .required("Phone is required"),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Message is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    address: yup.string().required("Address is required"),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
     defaultValues: {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    subject: "",
    message: "",
    country: "Saudi Arabia", // fixed
    state: user?.state,
    city: user?.city,
    address: user?.billing_address,
  },
  });

  const [formData, setFormData] = useState({
    state: "",
    city: "",
    address: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);

    const defaultCities = City.getCitiesOfCountry("SA");
    setCities(defaultCities);
    const defaultStates = State.getStatesOfCountry("SA");
    setStates(defaultStates);
  }, []);
  useEffect(() => {
    if (formData.state) {
      const selectedState = states.find((s) => s.name == formData.state);
      const selectedCountry = countries.find((s) => s.name == formData.country);
      const allCities = City.getCitiesOfState(
        selectedCountry.isoCode,
        selectedState.isoCode
      );

      setCities(allCities);
    }
  }, [formData.state]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone_number: data.phone,
        subject: data.subject,
        message: data.message,
        country: data.country,
        state: data.state,
        city: data.city,
        address: data.address,

      };

      const response = await userApi.contactmessage(payload);

      console.log("API response:", response);

      if (response?.status) {
        toast.success("Message sent successfully! ✅");
        reset();
      } else {
        const errorMsg = response?.message || "Something went wrong ❌";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Submit error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        "Failed to send message. Please try again later.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="bg-[#FAFAFA] md:p-5 p-3  rounded-2xl">
      <h1 className="text-3xl mb-2">{t("Contact us")}</h1>
      <p className="text-black mb-6">
        {t(
          "We’ll ask a few questions – so we can help you find the answer, or to get in touch with us."
        )}
      </p>
      <div className="flex">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-4xl rounded-lg border-green-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-green-600 font-semibold mb-1">
                {t("Name")}
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={t("Enter your name")}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-green-600 font-semibold mb-1">
                {t("Email")}
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={t("Enter your email")}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-green-600 font-semibold mb-1">
                {t("Phone Number")}
              </label>
              <input
                type="text"
                {...register("phone")}
                className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={t("Enter your phone number")}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-green-600 font-semibold mb-1">
                {t("Subject")}
              </label>
              <input
                type="text"
                {...register("subject")}
                className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={t("Enter subject")}
              />
              {errors.subject && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium">
                {t("Country")}
              </label>
              <input
                type="text"
                value="Saudi Arabia"
                readOnly
                disabled
                className="w-full p-1.5 border border-gray-200 rounded bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium">{t("State")}</label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={states.map((s) => ({
                      label: s.name,
                      value: s.name,
                    }))}
                    onChange={(selected) => {
                      field.onChange(selected?.value);
                      setFormData((prev) => ({
                        ...prev,
                        state: selected?.value,
                      }));
                    }}
                    value={
                      field.value
                        ? { label: field.value, value: field.value }
                        : null
                    }
                    placeholder={t("Select a state")}
                    isClearable
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.state && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium">{t("City")}</label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={cities.map((c) => ({
                      label: c.name,
                      value: c.name,
                    }))}
                    onChange={(selected) => {
                      field.onChange(selected?.value);
                      setFormData((prev) => ({
                        ...prev,
                        city: selected?.value,
                      }));
                    }}
                    value={
                      field.value
                        ? { label: field.value, value: field.value }
                        : null
                    }
                    placeholder={t("Select a city")}
                    isClearable
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.city && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* Address */}
            {/* <div className="md:col-span-3">
              <label className="block text-sm font-medium">
                {t("Address")}
              </label>
              <input
                type="text"
                {...register("address")}
                className="w-full p-2.5 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={t("Enter your address")}
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div> */}
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="block text-green-600 font-semibold mb-1">
              {t("Message")}
            </label>
            <textarea
              rows="4"
              {...register("message")}
              className="w-full p-3 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder={t("Write your message")}
            />
            {errors.message && (
              <p className="text-red-600 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-44 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition"
          >
            {t("Send Message")}
          </button>
        </form>
      </div>
      {/* 🚀 Future Enhancements (Planned): */}
      {/* <div className="space-y-6 max-w-xl">
        <InputField
          label={t("What does your question relate to?")}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[t("Account"), t("Buying"), t("Selling"), t("Shipping")]}
        />

        <InputField
          label={t("What can we help with?")}
          value={helpWith}
          onChange={(e) => setHelpWith(e.target.value)}
          options={[t("Emails"), t("Payments"), t("Listings")]}
        />

        <InputField
          label={t("Select the most relevant option")}
          value={option}
          onChange={(e) => setOption(e.target.value)}
          options={[
            t("trouble receiving Ma3rood emails"),
            t("email preferences"),
            t("unsubscribe help"),
          ]}
        />

        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-semibold mb-1">{t("Managing Book a courier")}</h2>
          <p className="text-sm text-gray-600 mb-3">
            {t("If you're having issues with your courier booking, we can help")}
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {t("Read more")}
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default ContactForm;
