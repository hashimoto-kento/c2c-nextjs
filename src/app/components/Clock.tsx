"use client";

import React, { useState, useEffect } from "react";

const UPDSATE_CYCLE = 1000;

const KEY_LOCAL_STORAGE = "KEY_LOCAL";

enum Locale {
  US = "en-US",
  JP = "ja-JP",
}

const getLocaleFromString = (text: string) => {
  switch (text) {
    case Locale.US:
      return Locale.US;
    case Locale.JP:
      return Locale.JP;
    default:
      return Locale.JP;
  }
};

export const Clock = () => {
  const [timestamp, setTimestamp] = useState(new Date());
  const [locale, setLocale] = useState(Locale.US);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date());
    }, UPDSATE_CYCLE);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const savedLocale = localStorage.getItem(KEY_LOCAL_STORAGE);
    if (savedLocale !== null) {
      setLocale(getLocaleFromString(savedLocale));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY_LOCAL_STORAGE, locale);
  }, [locale]);

  return (
    <div className="mt-4 px-2 text-sm text-gray-600">
      <span>:{timestamp.toLocaleString(locale)}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(getLocaleFromString(e.target.value))}
        className="ml-2 text-xs bg-transparent border-none"
      >
        <option value="en-US">EN</option>
        <option value="ja-JP">JP</option>
      </select>
    </div>
  );
};
