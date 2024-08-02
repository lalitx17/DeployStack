# DeployStack

DeployStack is a modern, full-stack deployment automation tool designed to simplify the process of deploying applications. It leverages cutting-edge technologies and cloud services to ensure smooth, repeatable, and reliable deployments.

## Features

- **Automated Deployments**: Streamline the deployment process with automated scripts.
- **Cloud Integration**: Seamless integration with AWS services like S3 and SQS.
- **Modern UI**: Sleek and responsive user interface built with Shadcn UI components.
- **Fast Development**: Utilizes Vite for rapid development and hot module replacement.

## Tech Stack

DeployStack is built using the following technologies:

- **Frontend**:
  - Vite: Next-generation frontend tooling
  - Shadcn UI: A collection of re-usable components built with Radix UI and Tailwind CSS
  - React (assumed, as Shadcn UI is typically used with React)

- **Backend**:
  - MongoDB: NoSQL database for flexible data storage
  - AWS S3: Object storage for deployment artifacts
  - AWS SQS: Message queuing service for managing deployment tasks

## Installation

To install DeployStack, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/lalitx17/DeployStack.git
   cd DeployStack
    ```
2. Install dependencies:
    ```bash
    cd frontend
    npm install
    cd ..
    cd upload
    npm install
    cd ..
    cd deploy
    npm install
    cd ..
    cd serve
    npm install
    cd ..
    ```
3. Set up environment variables:
    - Create a `.env` file in the `upload` directory and add the following variables:
      ```plaintext
      AWS_ACCESS_KEY_ID=your_access_key_id
      AWS_SECRET_ACCESS_KEY=your_secret_access_key
      AWS_REGION=your_aws_region
      AWS_BUCKET_NAME=your_bucket_name
      MongoDB_URI=your_mongodb_uri
      ```
    - Create a `.env` file in the `deploy` directory and add the following variables:
      ```plaintext
      AWS_ACCESS_KEY_ID=your_access_key_id
      AWS_SECRET_ACCESS_KEY=your_secret_access_key
      AWS_REGION=your_aws_region
      AWS_QUEUE_URL=your_queue_url
      MongoDB_URI=your_mongodb_uri
      ```
    - Create a `.env` file in the `serve` directory and add the following variables:
      ```plaintext
      AWS_ACCESS_KEY_ID=your_access_key_id
      AWS_SECRET_ACCESS_KEY=your_secret_access_key
      AWS_REGION=your_aws_region
      AWS_BUCKET_NAME=your_bucket_name
      MongoDB_URI=your_mongodb_uri
      ```

4. Start the frontend server:
    ```bash
    cd frontend
    npm run dev
    ```
5. Start the upload server:
    ```bash
    cd upload
    npm start
    ```
6. Start the deploy server:
    ```bash
    cd deploy
    npm start
    ```
7. Start the serve server:
    ```bash
    cd serve
    npm start
    ```
8. Open your browser and navigate to `http://localhost:3000` to access DeployStack.
