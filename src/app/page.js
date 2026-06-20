import HeroSection from "@/components/home/HeroSection";
import FeaturedRecipes from "@/components/home/FeaturedRecipes";
import PopularRecipes from "@/components/home/PopularRecipes";
import WhyRecipeHub from "@/components/home/WhyRecipeHub";
import ChefCommunity from "@/components/home/ChefCommunity";

export default function Home() {
    return (
        <>
            <HeroSection />
            <FeaturedRecipes />
            <PopularRecipes />
            <WhyRecipeHub />
            <ChefCommunity />
        </>
    );
}