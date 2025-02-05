export function  shareComment (category: string, country: string, city: string, business: string, title: string, content: string, commentId: string) {
    const shareUrl = `${window.location.origin}/${category}/${country.toLowerCase()}/${encodeURIComponent(city).toLowerCase()}/${business.replace(/\s+/g, '-')}/#review-${commentId}`;
    const shareText = `${title}: ${content}`;
    if (navigator.share) {
        // Use the native share API if available
        navigator
            .share({
                title: "Check out this review",
                text: shareText,
                url: shareUrl,
            })
            .then(() => console.log("Review shared successfully!"))
            .catch((error) => console.error("Sharing failed:", error));
    } else {
        // Fallback to copy the link to the clipboard
        const fullShareUrl = `${shareUrl}?text=${encodeURIComponent(shareText)}`;
        navigator.clipboard.writeText(fullShareUrl);
        alert("Share link copied to clipboard!");
    }
};
