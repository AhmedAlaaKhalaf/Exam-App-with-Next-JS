'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from 'react';
import { getApiBase, authHeaders, isApiFailure, apiErrorMessage } from "@/lib/api";

type DiplomaRow = {
  id: string;
  title: string;
  image: string | null;
  createdAt: string;
};

type PaginationMetadata = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type DiplomasEnvelope = {
  status: boolean;
  payload?: {
    data: DiplomaRow[];
    metadata: PaginationMetadata;
  };
};

export default function InfiniteDiplomasList({ accessToken }: { accessToken: string }) {
  const [visibleCount, setVisibleCount] = useState(4);

  const fetchDiplomas = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(
      `${getApiBase()}/diplomas?page=${pageParam}&limit=4`,
      {
        headers: {
          ...authHeaders(accessToken),
        },
      }
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(apiErrorMessage(body, 'Failed to fetch diplomas'));
    }

    const data = (await response.json()) as DiplomasEnvelope;
    if (isApiFailure(data) || !data.payload) {
      throw new Error(apiErrorMessage(data, 'Failed to fetch diplomas'));
    }
    return data.payload;
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
      const { page, totalPages } = lastPage.metadata;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const allDiplomas = data?.pages.map((page) => page.data).flat() || [];
  const visibleDiplomas = allDiplomas.slice(0, visibleCount);
  const hasMoreInFetched = visibleCount < allDiplomas.length;
  const hasMoreToShow = hasMoreInFetched || hasNextPage;

  const handleViewMore = async () => {
    if (hasMoreInFetched) {
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
        {visibleDiplomas.map((diploma) => (
          <Link
            href={`/dashboard/exams?diploma=${encodeURIComponent(diploma.id)}`}
            className="lg:w-1/2 md:w-1/2 w-full p-1 block cursor-pointer hover:opacity-90 transition-opacity"
            key={diploma.id}
          >
            <div className="relative overflow-hidden">
              <div className="w-full h-[448px] relative">
                {diploma.image ? (
                  <Image
                    src={diploma.image}
                    alt={diploma.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-geistMono">
                    No image
                  </div>
                )}
              </div>
              <div className="py-4 px-2 absolute bottom-2 left-2 right-2 bg-[#155DFC]/50">
                <h2 className="text-white text-lg font-geistMono font-semibold line-clamp-2">{diploma.title}</h2>
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
