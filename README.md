# Draft.js Text Editor

A simple text editor built with Draft.js that supports markdown-style shortcuts for text formatting.

## Features

- Markdown-style shortcuts for text formatting:
  - `#` + space for heading
  - `*` + space for bold text
  - `**` + space for red text
  - `***` + space for underlined text
- Auto-save functionality using localStorage
- Clean and simple interface

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mdansarijaved/zicuro.git
cd zicuro
```

2. Install dependencies:

```bash
npm install
```

## Running the Project

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to:

```
http://localhost:5173/
```

## Usage

1. Start typing in the editor
2. Use markdown shortcuts to format your text:
   - Type `#` at the start of a line and press space for heading
   - Type `*` at the start of a line and press space for bold text
   - Type `**` at the start of a line and press space for red text
   - Type `***` at the start of a line and press space for underlined text
3. Click the "Save" button to save your content
4. Your content will be automatically loaded when you refresh the page

## Technologies Used

- React
- Draft.js
- TypeScript
- CSS3

## Project Structure

```
src/
  ├── editor.tsx      # Main editor component
  ├── index.css       # Global styles
  └── App.css         # Component-specific styles
```
