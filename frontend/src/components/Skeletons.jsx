import React from 'react';

/**
 * Skeleton Loading Components for Better UX
 * Provides smooth loading animations instead of blank screens
 */

// ==================== SKELETON CARD ====================
export const SkeletonCard = ({ className = '', height = 'h-32' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2`}></div>
      <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
    </div>
    <div className={`h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2`}></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
  </div>
);

// ==================== SKELETON STAT CARD ====================
export const SkeletonStatCard = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
      </div>
      <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
    </div>
  </div>
);

// ==================== SKELETON TABLE ====================
export const SkeletonTable = ({ rows = 5, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
    {/* Table Header */}
    <div className="flex space-x-4 mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-18 animate-pulse"></div>
    </div>
    {/* Table Rows */}
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-18 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

// ==================== SKELETON CHART ====================
export const SkeletonChart = ({ className = '', height = 'h-80' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse ${className}`}>
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
      <div className="flex space-x-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
      </div>
    </div>
    <div className={`${height} bg-gray-200 dark:bg-gray-700 rounded-lg flex items-end justify-around p-4`}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-300 dark:bg-gray-600 rounded-t w-8 animate-pulse"
          style={{
            height: `${Math.random() * 60 + 20}%`,
            animationDelay: `${i * 0.1}s`
          }}
        ></div>
      ))}
    </div>
  </div>
);

// ==================== SKELETON LIST ====================
export const SkeletonList = ({ items = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ==================== SKELETON TEXT ====================
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
        style={{ width: `${Math.random() * 40 + 60}%` }}
      ></div>
    ))}
  </div>
);

// ==================== SKELETON GRID ====================
export const SkeletonGrid = ({
  columns = 3,
  rows = 2,
  className = '',
  cardHeight = 'h-48'
}) => (
  <div className={`grid gap-6 ${columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} ${className}`}>
    {Array.from({ length: columns * rows }).map((_, i) => (
      <div key={i} className={`${cardHeight} bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse`}>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-3"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
      </div>
    ))}
  </div>
);

// ==================== SKELETON FORM ====================
export const SkeletonForm = ({ fields = 3, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse ${className}`}>
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        </div>
      ))}
      <div className="h-10 bg-green-300 dark:bg-green-800 rounded w-32 mt-6"></div>
    </div>
  </div>
);

export default {
  SkeletonCard,
  SkeletonStatCard,
  SkeletonTable,
  SkeletonChart,
  SkeletonList,
  SkeletonText,
  SkeletonGrid,
  SkeletonForm
};