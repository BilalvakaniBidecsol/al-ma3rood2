# Services Module – Backend API 

## 1. Service Categories (exists)

## 2. Service Category Tree (exists)

## 3. Regions & Governorates (exists)

## 4. List Services (browse/search)

**Purpose**  
Returns service listings filtered by the query params.

**Query Params**
- `query` – optional text search.
- `category`, `subcategory` – optional category filters.
- `region`, `area` – optional location filters.
- `price_min`, `price_max` – numeric price range.
- `sort` – `"featured" | "price-low-high" | "price-high-low" | "rating"`.
- `page`, `page_size` – for pagination (numbers, optional).

**Response**
```json
{
  "data": [
    {
      "slug": "premium-home-cleaning-organisation",
      "title": "Premium Home Cleaning & Organisation",
      "subtitle": "Weekly and one-off deep cleans…",
      "description": "Full description used on detail page.",
      "category": "home-garden",
      "subcategory": "Cleaning Services",
      "region": "Makkah",
      "region_label": "Makkah",
      "area": "North Shore",
      "price": 98,
      "price_unit": "per visit",
      "rating": 4.9,
      "reviews": 182,
      "response_time": "Usually responds in 1 hour",
      "next_availability": "Available this Friday",
      "is_verified": true,
      "badges": ["Top Rated", "Background Checked"],
      "experience": "8 years experience",
      "photo": {
        "url": "https://cdn.example.com/services/svc-101.jpg",
        "width": 640,
        "height": 480,
        "alt": "Professional cleaners tidying a modern living room"
      },
      "tags": ["Eco products", "Pet friendly", "Move-out cleans"],
      "created_at": "2025-01-20T08:15:00.000Z",
      "updated_at": "2025-01-21T10:30:00.000Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 134
  }
}
```

---

## 5. Get Service Detail

**Endpoint**  
`GET /api/services/:serviceSlug`

**Purpose**  
Detailed record for a single service, driving the service detail page.

**Response**
```json
{
  "slug": "premium-home-cleaning-organisation",
  "title": "Premium Home Cleaning & Organisation",
  "subtitle": "Weekly and one-off deep cleans…",
  "description": "Full description with line breaks, bullet points, etc.",
  "category": "home-garden",
  "subcategory": "Cleaning Services",
  "region": "makkah",
  "region_label": "Makkah",
  "area": "North Shore",
  "price": 98,
  "price_unit": "per visit",
  "rating": 4.9,
  "reviews": 182,
  "response_time": "Usually responds in 1 hour",
  "next_availability": "Available this Friday",
  "is_verified": true,
  "badges": ["Top Rated", "Background Checked"],
  "experience": "8 years experience",
  "photo": { "...": "..." },
  "gallery": [
    {
      "url": "https://cdn.example.com/services/svc-101-1.jpg",
      "width": 960,
      "height": 720,
      "alt": "Kitchen after cleaning"
    }
  ],
  "tags": ["Eco products", "Pet friendly", "Move-out cleans"],
  "created_at": "2025-01-20T08:15:00.000Z",
  "updated_at": "2025-01-21T10:30:00.000Z"
}
```

---

## 6. Related Services

**Endpoint**  
`GET /api/services/:serviceSlug/related`

**Purpose**  
Returns a small list of related providers by category/location for the “Similar services” section.

**Query Params (optional)**
- `limit` (default 4)
- `category` – override default category match.

**Response**
```json
{
  "data": [
    {
      "slug": "luxury-apartment-cleaning",
      "title": "Luxury Apartment Cleaning",
      "subtitle": "Specialised cleaning for apartments…",
      "category": "home-garden",
      "subcategory": "Cleaning Services",
      "region": "makkah",
      "region_label": "Makkah",
      "area": "CBD",
      "price": 140,
      "price_unit": "per visit",
      "rating": 4.8,
      "reviews": 76,
      "photo": { "...": "..." }
    }
  ]
}
```

---

## 7. Create Service Listing

**Endpoint**  
`POST /api/services`

**Purpose**  
Creates a new service listing from the “Create Service” form in the listing hub.

**Request Body**
```json
{
  "title": "Premium Home Cleaning & Organisation",
  "subtitle": "Weekly and one-off deep cleans…",
  "description": "Full service description…",
  "category": "home-garden", 
  "subcategory": "Cleaning Services",
  "region": "makkah",
  "area": "North Shore",
  "price": 98,
  "price_unit": "per visit",
  "experience": "8 years experience",
  "next_availability": "Available this Friday",
  "tags": ["Eco products", "Pet friendly", "Move-out cleans"],
  "photo": {
    "url": "https://cdn.example.com/uploaded-photos/svc-101-cover.jpg",
    "width": 640,
    "height": 480,
    "alt": "Professional cleaners tidying a modern living room"
  }
}
```

**Response (201)**
```json
{
  "slug": "premium-home-cleaning-organisation",
  "created_at": "2025-02-05T09:45:00.000Z"
}
```

