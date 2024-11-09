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
      return Locale.US;
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
    <div>
      <p>
        <span id="current-time-label"></span>
        <span>:{timestamp.toLocaleString(locale)}</span>
        <select
          value={locale}
          onChange={(e) => setLocale(getLocaleFromString(e.target.value))}
        >
          <option value="en-US">en-US</option>
          <option value="ja-JP">ja-JP</option>
        </select>
      </p>
    </div>
  );
};
