import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useRouter } from 'next/router';
import { GoSearch } from 'react-icons/go';
import { getBusinessNameWithReviews, getCategoryName } from '../../lib/types/helpers/backendHelpers';
import { camelToKebab } from '../../utilities/camel';
import { translateCategoryToEnglish } from '../../lib/types/categoryTranslationToEnglish';
import Image from 'next/image';


const SearchBar = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]); // Contient à la fois entreprises et catégories
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Recherche les entreprises et les catégories
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.length >= 1) {
        const translatedQuery = translateCategoryToEnglish(searchQuery);
        const fetchData = async () => {
          setLoading(true);
          setError(null);
          try {
            // Requêtes pour entreprises et catégories
            const businessResponse = await getBusinessNameWithReviews({ name: searchQuery, page_size: 5 });
            const categoryResponse = await getCategoryName({ name: translatedQuery });

            // Combinez les résultats des entreprises et des catégories
            setResults([
              ...categoryResponse.results.map((cat: any) => ({ ...cat, type: 'category' })),
              ...businessResponse.results.map((biz: any) => ({ ...biz, type: 'business' })),
            ]);
          } catch (error) {
            console.error("Error fetching results:", error);
            setError(t.errorFetchingResults || 'An error occurred while fetching results.');
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, t.errorFetchingResults]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSelectedItem(null);
  };

  const handleSelect = (item: any) => {
    setSearchQuery(item.name);
    setSelectedItem(item.name);

    if (item.type === 'business') {
      // Redirige vers la page de l'entreprise
      const encodedBusiness = item.name.replace(/\s+/g, '-');
      router.push(`/${camelToKebab(item.category.name)}/${item.country.toLowerCase()}/${encodeURIComponent(item.city).toLowerCase()}/${encodedBusiness}`);
    } else if (item.type === 'category') {
      // Redirige vers la page de la catégorie
      router.push(`/${camelToKebab(item.name)}/`);
    }

    setResults([]);
    setSearchQuery('');
  };
  return (
    <div className="relative md:w-2/3">
      <div className="max-w-[50rem] w-full md:w-[90%] px-4 md:ltr:ml-4 md:rtl:mr-4 rounded-lg bg-slate-600/10 dark:bg-slate-800 flex items-center flex-grow">
        <GoSearch style={{ color: "rgb(156 163 175)" }} />
        <input
          type="search"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={`${t.searchCategoryBusiness || "Search Business or Category"}`}
          className="px-4 py-2 md:py-3 bg-transparent outline-none w-full placeholder:text-[11px] md:placeholder:text-[14px]" />

      </div>

      {loading && (
        <div className="absolute w-full md:w-[90%] px-4 md:ltr:ml-4 rounded-lg md:rtl:mr-4 bg-white shadow-lg max-h-100 text-center z-[2000] overflow-y-auto">
          <p className="text-gray-500 text-[14px]">{t.loading}...</p>
        </div>
      )}
      {error && (
        <div className="absolute w-full md:w-[90%] px-4 md:ltr:ml-4 md:rtl:mr-4 rounded-lg bg-white shadow-lg max-h-100 text-left z-[2000] overflow-y-auto">
          <p className="text-red-500 font-normal text-left text-[14px]">{error}</p>
        </div>
      )}
      {searchQuery && results.length > 0 && (
        <ul className="absolute w-full md:w-[90%] px-4 md:ltr:ml-4 md:rtl:mr-4 bg-white rounded-lg shadow-lg max-h-100 text-left z-[2000] overflow-y-auto">
          {results.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="group px-4 py-3 cursor-pointer flex items-center rounded-lg space-x-4 hover:bg-gray-100 transition duration-200 ease-in-out"
            >
              <div className="flex items-center justify-center">
                {item.type === 'business' ? (
                  item.logo ? (
                    <Image
                      src={`${item.logo}`}
                      alt="business logo"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/images/default-business.webp"
                      alt="businesslogo"
                      width={40}
                      height={40}
                      className='rounded-full object-cover'
                    />
                  )
                ) : (
                  <div className="text-gray-500 font-semibold">#</div>
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-gray-800 group-hover:text-gray-600">
                  {t[item.name]}
                </div>
                <div className="text-sm text-gray-500">
                  {item.type === 'business'
                    ? `${item.city} • ${item.countrynamecode} • ${t[item.category.name]}`
                    : t.category}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {searchQuery && results.length === 0 && (
        <div className="absolute w-full rounded-lg md:w-[90%] px-4 md:ltr:ml-4 md:rtl:mr-4 bg-white shadow-lg max-h-100 text-left z-[2000] overflow-y-auto">
          <p className="text-gray-800 font-semibold text-left text-[14px]">{t.notFound}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
