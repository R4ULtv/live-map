# Cloudflare Worker - Online Users API

This project is a simple API built using the Hono framework, designed to manage online user locations. It runs as a Cloudflare Worker and utilizes Cloudflare's KV (Key-Value) storage for data persistence.

## Features

- **CORS Support**: The API supports Cross-Origin Resource Sharing (CORS) for all routes.
- **Online User Count**: Retrieve the count of currently online users.
- **Online User Locations**: Fetch unique locations of online users.
- **Add User Location**: Store a user's location in the KV store.

## Endpoints

### `GET /`

Returns a simple message indicating the API is running.

### `GET /online-count`

Returns the number of online users.

**Response:**

```json
{
  "count": 3
}
```

### `GET /online-locations`

Fetches and returns unique locations of online users.

**Response:**

```json
[
  {
    "country": "US",
    "city": "San Francisco",
    "region": "CA",
    "latitude": "37.7809",
    "longitude": "-122.4245"
  }
]
```

### `POST /add-location`

Adds a user's location to the KV store.

**Request Body:**

```json
{
  "requestID": "30c68435-5698-4fbf-99f0-9e0f2923d98c",
  "location": {
    "country": "US",
    "city": "San Francisco",
    "region": "CA",
    "latitude": "37.7749",
    "longitude": "-122.4194"
  }
}
```

## Setup

1. Clone the repository.
2. Install dependencies using npm or yarn.
3. Deploy the worker to Cloudflare.

## License

This project is licensed under the MIT License.
