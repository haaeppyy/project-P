import HeroLayout from "./HeroLayout";
import GalleryFrame from "./GalleryFrame/GalleryFrame";

export default function Hero() {
  return <HeroLayout frame={<GalleryFrame />} />;
}
