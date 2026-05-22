# Loading SPA Note

```mermaid
sequenceDiagram
    participant browser
    participant server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: 200 OK<br/>HTML document
    deactivate server

    Note left of browser: Browser parses HTML document, starts fetching<br/>linked documents.
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser 200 OK<br/>CSS document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser 200 OK<br/>JavaScript document
    deactivate server

    Note left of browser: Fetched JavaScript code executes, triggers fetch of JSON file.
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: 200 OK <br/>JSON document
    deactivate server

```
