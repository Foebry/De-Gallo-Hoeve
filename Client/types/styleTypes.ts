const styleTypes = {
  SECTION_DARKER: "bg-grey-900 px-5 py-5",
  SECTION_LIGHTER: "px-5 py-5",
  SECTION_CONTENT: "block max-w-8xl items-center py-24 mx-auto gap-12  md:flex",
  SECTION_CONTENT_IMGHOLDER: "w-95p xs:w-1/2 mx-auto shadow-md",
  SECTION_CONTENT_TEXT: "block align-center gap-12 p24 mx-auto md:max-w-2/3",
  SECTION_CONTENT_IMGHOLDER_IMG:
    "w-full border-solid border-2 border-gray-100 rounded block aspect-3/4 h-auto",
  SECTION_DIENSTEN: "w-95p flex gap-5 mx-auto justify-center flex-wrap mb-20 lg:w-90p",
  SECTION_IMAGES: "flex flex-grow flex-shrink flex-wrap gap-2.5 justify-center",
  SECTION_IMAGES_ARTICLE: "hidden first:block min-w-full max-w-1/2 basis-52 shadow-2sm 2xs:block 2xs:min-w-3xs xs:max-w-1/5 md:basis-15p lg:max-w-15p" ,
  FORM_CONTAINER: "w-full bg-grey-300 border-grey-900 border-solid border shadow-sm rounded-2xl mx-auto my-32 relative sm:w-1/2 min-h-50vh",
  FAILURE: "",
  SUCCESS: "absolute block left-20 right-20 px-5 py-2 bg-green-300 text-green-100 rounded border-solid border border-green-500",
};

export const {
  SECTION_DARKER,
  SECTION_LIGHTER,
  SECTION_CONTENT,
  SECTION_IMAGES,
  SECTION_CONTENT_IMGHOLDER,
  SECTION_CONTENT_IMGHOLDER_IMG,
  SECTION_CONTENT_TEXT,
  SECTION_DIENSTEN,
  FORM_CONTAINER,
  SUCCESS,
  FAILURE
} = styleTypes;
