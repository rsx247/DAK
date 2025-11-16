# Icons8 MCP Server Setup Guide

This guide will help you connect to the Icons8 MCP server to access free PNG icons and (with API key) SVG icons.

## Setup Instructions for Cursor

### Step 1: Open Cursor Settings
1. Open **Cursor** → **Settings** → **Cursor Settings**
2. Go to the **MCP** tab
3. Click **+ Add new global MCP server**

### Step 2: Choose Your Configuration

#### Option A: Free PNG Icons (No API Key Required)
Use this configuration for free PNG icon previews:

```json
{
  "mcpServers": {
    "icons8mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.icons8.com/mcp/"
      ]
    }
  }
}
```

#### Option B: SVG Icons (Requires API Key - $15/month)
For SVG icons, you need to subscribe to Icons8 ($15/month) and get your API key from the MCP tab in your Icons8 account:

```json
{
  "mcpServers": {
    "icons8mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.icons8.com/mcp/",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

**Replace `YOUR_API_KEY` with your actual API key from Icons8.**

### Step 3: Save and Restart
1. Save the configuration
2. Restart Cursor if needed
3. The Icons8 MCP server should now be available

## Usage Examples

Once connected, you can ask the AI assistant:

- "Create a web page with MCP server icon SVG in ios glyph style"
- "Create a dashboard with analytics SVG icons in color style"
- "Get a vegan leaf icon in SVG format"
- "Show me a Euro symbol icon"

## Features

- **Free PNG icons**: Available without API key for quick prototyping
- **SVG icons**: Available with paid API key ($15/month subscription)
- **40,000+ icons**: Huge icon library with full coverage
- **Multiple styles**: iOS glyph, color, outline, and more

## License

- **PNG icons (free)**: Free to use if you provide a link back to Icons8
- **SVG icons (paid)**: Check Icons8 license terms for your subscription

## Troubleshooting

### "No API key" error
- For SVG icons, you need to subscribe ($15/month) and get your API key from the MCP tab in your Icons8 account
- For PNG icons, no API key is needed

### Getting PNG instead of SVG
- Make sure your API key is properly configured
- Explicitly request SVG format in your request

## Reference

- [Icons8 MCP Documentation](https://icons8.com/mcp/#how-to-use)
- [Icons8 Developer Portal](https://icons8.com/developers)

