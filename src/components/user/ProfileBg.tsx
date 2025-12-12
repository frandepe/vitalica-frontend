// import { useImageUpload } from "@/hooks/useImageUpload";
// import { ImagePlus, X } from "lucide-react";
// import { useState } from "react";

// function ProfileBg({ defaultImage }: { defaultImage?: string }) {
//   const [hideDefault, setHideDefault] = useState(false);
//   const {
//     previewUrl,
//     fileInputRef,
//     handleThumbnailClick,
//     handleFileChange,
//     handleRemove,
//   } = useImageUpload();

//   const currentImage = previewUrl || (!hideDefault ? defaultImage : null);

//   const handleImageRemove = () => {
//     handleRemove();
//     setHideDefault(true);
//   };

//   return (
//     <div className="h-52">
//       <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-muted rounded-b-2xl">
//         {currentImage && (
//           <img
//             className="h-full w-full object-cover"
//             src={currentImage}
//             alt={
//               previewUrl
//                 ? "Preview of uploaded image"
//                 : "Default profile background"
//             }
//             width={512}
//             height={96}
//           />
//         )}
//         <div className="absolute inset-0 flex items-center justify-center gap-2">
//           <button
//             type="button"
//             className="z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-ring/70"
//             onClick={handleThumbnailClick}
//             aria-label={currentImage ? "Change image" : "Upload image"}
//           >
//             <ImagePlus size={16} strokeWidth={2} aria-hidden="true" />
//           </button>
//           {currentImage && (
//             <button
//               type="button"
//               className="z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-ring/70"
//               onClick={handleImageRemove}
//               aria-label="Remove image"
//             >
//               <X size={16} strokeWidth={2} aria-hidden="true" />
//             </button>
//           )}
//         </div>
//       </div>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         className="hidden"
//         accept="image/*"
//         aria-label="Upload image file"
//       />
//     </div>
//   );
// }

// export default ProfileBg;
import { useAuth } from "@/hooks/useAuth";

function ProfileBg() {
  const { user } = useAuth();

  const getBannerData = () => {
    switch (user?.role) {
      case "ADMIN":
        return {
          src: "/Banners/banner-admin-profile.jpg",
          alt: "Imagen de portada para administradores. Fondo profesional que representa la gestión del sistema.",
        };
      case "INSTRUCTOR":
        return {
          src: "/Banners/banner-instructor-profile.jpg",
          alt: "Imagen de portada para instructores. Fondo educativo que simboliza enseñanza y guía.",
        };
      case "USER":
      default:
        return {
          src: "/Banners/banner-user-profile.jpg",
          alt: "Imagen de portada para usuarios. Fondo amigable que representa la participación en la comunidad.",
        };
    }
  };

  const { src, alt } = getBannerData();

  return (
    <div className="h-52">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-muted rounded-b-2xl">
        <img
          className="h-full w-full object-cover"
          src={src}
          alt={alt}
          width={512}
          height={96}
        />
      </div>
    </div>
  );
}

export default ProfileBg;
