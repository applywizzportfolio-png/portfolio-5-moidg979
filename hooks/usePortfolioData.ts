"use client";
import { useState, useEffect } from 'react';

export function usePortfolioData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/portfolioData.json')
      .then(res => res.json())
      .then(json => {
        setData({
          ...json,
          personal: { ...json.personal, name: json.personal?.name || 'User' },
          customSections: json.customSections || []
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { data, loading };
}
