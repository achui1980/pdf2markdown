# PDF to Markdown Converter

This project converts PDF files to Markdown format using `zerox`.

## Project Structure

- `backend/`: Node.js Express server that handles file uploads and conversion.
- `frontend/`: React application for the user interface.

## Prerequisites

- Node.js and npm
- An OpenAI API key

## Setup and Running the Project

### Backend

1.  Navigate to the `backend` directory:
    ```sh
    cd backend
    ```

2.  Install the dependencies:
    ```sh
    npm install
    ```

3.  Create a `.env` file in the `backend` directory and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key
    ```

4.  Start the backend server:
    ```sh
    npm start
    ```

    The server will be running on `http://localhost:3000`.

### Frontend

1.  Navigate to the `frontend` directory:
    ```sh
    cd ../frontend
    ```

2.  Install the dependencies:
    ```sh
    npm install
    ```

3.  Start the React application:
    ```sh
    npm start
    ```

    The application will open in your browser at `http://localhost:3001` (or another port if 3001 is in use).

## How to Use

1.  Open the web application in your browser.
2.  Click the "Choose File" button to select a PDF file.
3.  Click the "Convert" button to upload the file and start the conversion process.
4.  The PDF will be previewed on the left, and the generated Markdown will be displayed on the right.
5.  Click the "Download Markdown" button to save the converted content as a `.md` file.