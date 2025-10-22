"use client";

import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/lib/stores/authStore";

export default function FeedbackModal({
  isOpen,
  onClose,
  onSave,
  initialFeedback = "",
  initialRating = 0, // 👈 prop add
}) {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0); // 👈 start from 0
  const [hoveredRating, setHoveredRating] = useState(0);

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    setFeedback(initialFeedback)
        setRating(initialRating); // 👈 pre-fill rating when modal opens
;
  }, [initialFeedback,initialRating, isOpen]);

  const handleClose = () => {
    setFeedback("");
    setRating(0);
    setHoveredRating(0);
    onClose();
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-[90%] max-w-md p-6 shadow-2xl relative transition-all">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} text-gray-400 hover:text-gray-600`}
          aria-label={t("Close")}
        >
          <FaTimes size={20} />
        </button>

        {/* Modal Title */}
        <h2 className={`text-xl font-semibold mb-4 ${isArabic ? "text-right" : "text-left"} text-gray-800`}>
          {t("We value your feedback")}
        </h2>

        {/* Star Rating */}
        <div className={`flex items-center gap-1 mb-4 ${isArabic ? "justify-end" : "justify-start"}`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
            //   onMouseEnter={() => setHoveredRating(star)}
            //   onMouseLeave={() => setHoveredRating(0)}
              className="text-yellow-500 text-2xl transition-colors"
              aria-label={`${star} ${t("star")}`}
            >
              {star <= (hoveredRating || rating) ? <FaStar /> : <FaRegStar />}
            </button>
          ))}
        </div>

        {/* Feedback Textarea */}
        <label htmlFor="feedback-textarea" className="block text-sm font-medium text-gray-700 mb-1">
          {t("Your Feedback")}
        </label>
        <textarea
          id="feedback-textarea"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          maxLength={512}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500 text-gray-800 resize-none"
          placeholder={t("Write your comments here...")}
        />
        <div className="text-xs text-gray-500 text-right mt-1">
          {512 - feedback.length} {t("characters remaining")}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            title={t("Cancel")}
            onClick={handleClose}
            className="text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
          />
          {/* <Button
            title={t("Submit")}
            onClick={() => {
              onSave({ feedback, rating });
              handleClose();
            }}
            className="text-sm"
          /> */}
          <Button
  title={t("Submit")}
  onClick={() => {
    if (rating === 0) {
      toast.error(t("Please select at least 1 star before submitting."));
      return; // empty rating prevent karne ke liye (optional)
    }
     if (!feedback) {
      toast.error(t("Please write your feedback before submitting."));
      return; // empty feedback prevent karne ke liye (optional)
    }
    onSave({ feedback, rating });
    handleClose();
  }}
  className="text-sm"
/>

        </div>
      </div>
    </div>
  );
}