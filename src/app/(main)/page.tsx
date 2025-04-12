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
    const response = await request({
      method: 'get',
      path: '/?prodLimit=8&servLimit=8&storeLimit=3'
    }).catch(error => {
      console.error('API Request failed:', error);
      return { data: { stores: [], categories: [], products: [], services: [] } };
    });

    // Ensure data has default values
    const stores = response?.data?.stores || [];
    const categories = response?.data?.categories || [];
    const products = response?.data?.products || [];
    const services = response?.data?.services || [];

    return (
      <>
        <TopBanner />
        <CategorySection />
        <TrendingProducts />
        <BecomeVendor />
        <PopularServices />
        <TopRatedVendors stores={stores} />
        <Setter
          categories={categories}
          products={products}
          services={services}
        />
      </>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    // Return fallback UI
    return <div>Something went wrong. Please try again later.</div>;
  }
}
