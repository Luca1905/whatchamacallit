export const prompts: ReadonlyArray<string> = [
	"The secret ingredient in my grandmother's famous recipe is whatchamacallit.",
	"I can't believe they're selling whatchamacallit at the grocery store now.",
	"My doctor told me to avoid whatchamacallit for my health.",
	"The new superhero's power is controlling whatchamacallit with their mind.",
	"Scientists just discovered that whatchamacallit is the key to time travel.",
	"My pet's favorite toy is a squeaky whatchamacallit.",
	"The restaurant's specialty dish is deep-fried whatchamacallit with sauce.",
	"I lost my job because I accidentally spilled whatchamacallit on my boss.",
	"The weather forecast calls for a 90% chance of whatchamacallit tomorrow.",
	"My therapist says I have an unhealthy obsession with whatchamacallit.",
] as const;

/**
 * Tailwind background classes used as player avatar colors. Must remain in sync with
 * any list used in Convex functions to ensure consistent color assignment across
 * client ↔ server boundaries.
 */
export const avatarColors: ReadonlyArray<string> = [
	"bg-red-500",
	"bg-blue-500",
	"bg-green-500",
	"bg-yellow-500",
	"bg-purple-500",
	"bg-pink-500",
	"bg-indigo-500",
	"bg-orange-500",
] as const;
