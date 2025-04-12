import useAxios from "@/hooks/useAxios";
import BecomeVendor from "@/sections/home/become-vendor";
import CategorySection from "@/sections/home/category-section";
import PopularServices from "@/sections/home/popular-services";
import Setter from "@/sections/home/setter";
import TopBanner from "@/sections/home/top-banner";
import TopRatedVendors from "@/sections/home/top-rated-vendors";
import TrendingProducts from "@/sections/home/trending-products";

export default async function Home() {
  try {
    const request = useAxios();
    
    const fetchData = async () => {
      try {
        const response = await request({
          method: 'get',
          path: '/?prodLimit=8&servLimit=8&storeLimit=3'
        });
        return response;
      } catch (error: any) {
        console.error('API Request failed:', error?.message || 'Unknown error');
        // Return default/fallback data
        return {
          data: {
            stores: [],
            categories: [],
            products: [],
            services: []
          }
        };
      }
    };

    // Add timeout to prevent long loading times
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );

    const response = await Promise.race([fetchData(), timeoutPromise])
      .catch(error => {
        console.error('Request failed or timed out:', error);
        return {
          data: {
            stores: [],
            categories: [],
            products: [],
            services: []
          }
        };
      });

    return (
      <>
        <TopBanner />
        <CategorySection />
        <TrendingProducts />
        <BecomeVendor />
        <PopularServices />
        <TopRatedVendors stores={response?.data?.stores || []} />
        <Setter
          categories={response?.data?.categories || []}
          products={response?.data?.products || []}
          services={response?.data?.services || []}
        />
      </>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    // Return fallback UI
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Temporarily Unavailable</h1>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }
}
