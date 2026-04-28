"use client";
import { useState, useEffect } from 'react';

export interface PortfolioData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    leetcode: string;
    hackerrank: string;
    portfolio: string;
  };
  summary: string;
  targetRole: string;
  skills: (string | { name: string })[];
  experiences: {
    role: string;
    company: string;
    period?: string;
    duration?: string;
    date?: string;
    desc: string;
  }[];
  educations: {
    degree: string;
    institution?: string;
    school?: string;
    year?: string;
    duration?: string;
    date?: string;
    grade: string;
  }[];
  projects: {
    title: string;
    description: string;
    techStack: string[];
    link: string;
    image?: string;
  }[];
  certifications: any[];
  custom: any[];
  customSections?: any[];
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(null);
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
