import { post, get, postbusiness, put, del } from "./apiHelpers";

// Authentication
export const postLogin = (data: any) => post("/login/", data);
export const postRefreshToken = (data: any) => post("/token/refresh/", data);
export const postSignup = (data: any) => post("/signup/", data);
export const postLogout = (data: any, token: string) => post("/logout/", data, {}, token);
export const postChangePassword = (data: any, token: string) => post("/change-password/", data, {}, token);
export const checkSession = (data: any, token: string) => get("/check-session/", data, {}, token);

// Business Operations
export const postBusiness = (data: any, token: string) => postbusiness("/businesses/", data, {}, token);
export const getAllBusiness = (data: any) => get("/businesses/", data);
export const getBusinessName = (data: any) => get("/businessnames/", data);
export const getBusinessesByCategory = (data: any, category: string) => get(`/businesses-by-category/${category}/`, data);
export const getBusinessBrand = (data: any) => get("/businessesbrand/", data);
export const getUserBusinesses = (data: any, token: string) => get("/user-businesses/", data, {}, token);
export const updateBusiness = (data: any, business_id: string, token: string) => put(`/business/${business_id}/`, data, {}, token);
export const deleteUserBusiness = (data: any, user_id: string, business_id: string, token: string) => del(`delete-user-business/${user_id}/${business_id}/`, data, {}, token);
export const getUserReviewsBusinesses = (data: any, token: string) => get("user/reviews/", data, {}, token);

// Business Details and Reviews
export const getBusinessDetails = (data: any) => get("/businessdetails", data);
export const getBusinessDetailsById = (data: any, business_id: string) => get(`/business/${business_id}`, data, {});
export const getBusinessReview = (data: any) => get("/business-reviews-list/", data);
export const getBusinessReviewByName = (data: any) => get("/filter-business-reviews-by-name/", data);
export const getRelatedBusiness = (data: any, business_id: string) => get(`/business/${business_id}/related/`, data);

export const getFilterBusinessesList = (data: any) => get("filter-businesses/", data);

// Reviews and Comments
export const postReview = (data: any) => post("/reviews/", data);
export const getReviews = (data: any) => get("/reviews/", data);
export const postComment = (data: any, token: string, review_id: string) => post(`create-comment/${review_id}/review/`, data, {}, token);
export const getComment = (data: any, token: string, review_id: string) => get(`/reviews/${review_id}/comments/`, data, {}, token);
export const deleteReview = (data: any, reviewId: string, token: string) => put(`deletereview/${reviewId}/`, data, {}, token);

// Categories
export const getCategories = (data: any) => get("/categories/", data);
export const getCategoriesAndNumberOfBusiness = (data:any) => get("category-business-count/", data);
export const getCategoryName = (data: any) => get("/filtercategoryname/", data);

// Collaborators
export const postCollaborator = (data: any, token: string) => post("/create-collaborator/", data, {}, token);
export const getCollaboratorSameBusiness = (data: any, token: string) => get("/users/same-business/", data, {}, token);
export const updateCollaboratorBusiness = (data: any, user_id: string, token: string) => post(`/change-business/${user_id}/`, data, {}, token);

// Miscellaneous
export const getBusinessNameWithReviews = (data: any) => get("/business-with-reviews/", data);
export const checkCodeStatus = (data: any, code: string) => get(`/check-code-status/${code}/`, data);
export const getSlide = (data: any) => get("/slides/", data);
export const getBanner = (data: any) => get("/banners/", data);
export const getReports = (data: any, token: string) => get("/reports/", data, {}, token);
export const getTranslations = (data:any, languagecode:string) => get(`/translations/?lang=${languagecode}`, data);



