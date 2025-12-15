'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from 'react';

type Subject = {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
};

type Metadata = {
  currentPage: number;
  numberOfPages: number;
  limit: number;
};

type ExamsResponse = {
  message: string;
  metadata: Metadata;
  subjects: Subject[];
};

export default function InfiniteDiplomasList({ accessToken }: { accessToken: string }) {
  const [visibleCount, setVisibleCount] = useState(4);

  const fetchDiplomas = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(`https://exam.elevateegy.com/api/v1/subjects?page=${pageParam}&limit=4`, {
      headers: {
        token: accessToken,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch diplomas');
    }

    const data: ExamsResponse = await response.json();
    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['diplomas', accessToken],
    queryFn: fetchDiplomas,
    getNextPageParam: (lastPage) => {
      const { currentPage, numberOfPages } = lastPage.metadata;
      return currentPage < numberOfPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Combine all pages' subjects into a single array
  const allDiplomas = data?.pages.map((page) => page.subjects).flat() || [];
  const visibleDiplomas = allDiplomas.slice(0, visibleCount);
  const hasMoreInFetched = visibleCount < allDiplomas.length;
  const hasMoreToShow = hasMoreInFetched || hasNextPage;

  const handleViewMore = async () => {
    if (hasMoreInFetched) {
      // Show next 4 from already fetched data
      setVisibleCount((prev) => prev + 4);
    } else if (hasNextPage) {
      await fetchNextPage();
      setVisibleCount((prev) => prev + 4);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[75vh] w-full">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-600">Error loading diplomas</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center flex-wrap">
        {visibleDiplomas.map((exam) => (
          <Link 
            href={`/dashboard/exams`}
            className="lg:w-1/2 md:w-1/2 w-full p-1 block cursor-pointer hover:opacity-90 transition-opacity"
            key={exam._id}
          >
            <div className="relative overflow-hidden">
              <div className="w-full h-[448px] relative">
                <Image 
                  src={exam.icon}
                  alt={exam.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="py-4 px-2 absolute bottom-2 left-2 right-2 bg-[#155DFC]/50">
                <h2 className="text-white text-lg font-geistMono font-semibold line-clamp-2">{exam.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMoreToShow && (
        <div className="flex justify-center items-center py-6">
          <button
            onClick={handleViewMore}
            disabled={isFetchingNextPage}
            className="px-6 py-2 text-gray-600 font-geistMono disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage
              ? 'Loading more...'
              : hasMoreInFetched
                ? 'Scroll to view more'
                : hasNextPage
                  ? 'Scroll to view more'
                  : 'Nothing more to load'}
          </button>
        </div>
      )}
    </div>
  );
}