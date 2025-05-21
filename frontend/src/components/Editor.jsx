import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { Form, Button } from "react-bootstrap";

/**
 * Editor Component
 *
 * Provides a Monaco-based Python code editor with theme toggle, reset, and submission controls.
 * Only logged-in users with the "user" role can submit or reset code.
 */
export default function Editor({ 
  theme, 
  setTheme, 
  code, 
  setCode, 
  codeTemplate, 
  onSubmit, 
  isLogin, 
  userRole 
}) {

  return (
    <div style={{ height: "80vh", overflowY: "auto" }}>
      {/* Header Section with Theme Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6>Code Editor</h6>
        {/* Theme Toggle Switch */}
        <Form.Check 
          type="switch"
          id="theme-switch"
          label={theme === "vs-dark" ? "🌙 Dark" : "☀️ Light"}
          checked={theme === "vs-dark"}
          onChange={() => setTheme(theme === "vs-dark" ? "vs" : "vs-dark")}
          className="ms-2"
        />
      </div>

      {/* Monaco Code Editor */}
      <MonacoEditor
        height="85%"
        language="python"
        theme={theme}
        value={code}
        onChange={(newCode) => setCode(newCode)}
        options={{
          fontSize: 12,
          minimap: { enabled: false },
          automaticLayout: true,
          padding: { top: 10 },
        }}
      />

      {/* Logged in user sees buttons for Submit & Clear */}
      {isLogin && userRole === "user" && (
        <div className="d-flex justify-content-between mt-2">
          <Button variant="light" size="sm" onClick={() => setCode(codeTemplate)}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      )}

      {/* when login but the admin, show the submit button, but disabled for admin */}
      {isLogin && userRole === "admin" && (
        <div className="d-flex justify-content-between mt-2">
          <Button variant="light" size="sm" onClick={() => setCode(codeTemplate)}>
            Reset
          </Button>
          <Button variant="primary" size="sm" disabled>
            Submit (Admin)
          </Button>
        </div>
      )}
    </div>
  );
}
