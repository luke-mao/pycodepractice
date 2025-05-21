# Frontend

The frontend uses the Vite Reactjs JavaScript template. 

The UI library is `react-bootstrap`.

The frontend is responsible for the user interface and user interaction with the website. The frontend is connected to the backend through API calls. The frontend is hosted on [http://localhost:3000](http://localhost:3000).

## Development Environment

Please ensure the backend service is running before starting the frontend. The frontend will not work without the backend service running.

```bash
cd frontend # if you are not in the frontend folder

npm install # install the dependencies

npm run dev # start the frontend on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## .env files

The frontend uses `.env.development` to store the backend API URL. The default value is `http://localhost:9000`. You can change this value to other values if your backend is running on a different port or host. 

When build the frontend for production, the `.env.production` file will be used. This file is not included in the repository. You can create this file by copying the `.env.development` file and changing the values as needed. The default value is `http://localhost:9000`. You can change this value to other values if your backend is running on a different port or host.
