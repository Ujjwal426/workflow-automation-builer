# ⚡ Workflow Builder – Frontend Assignment

This project is a **visual workflow builder** where users can create, configure, connect, and execute workflows using different node types like Trigger, HTTP, Email, Delay, and Condition.

Built using **Vue 3, Vue Flow, Pinia, TypeScript, and Tailwind CSS**.

---

## ▶ Run the App

```bash
npm install
npm run dev


# ⚡ Workflow Builder – Frontend Assignment

A visual workflow builder inspired by automation tools like Zapier / Make / n8n.
Users can visually compose workflows using nodes, connect them with edges, validate logic, and execute the flow step-by-step or continuously.

Open the app in the browser:

http://localhost:5173

---

## 🧩 Workflow Explanation (End-to-End)

This workflow demonstrates a **complete automation flow** using Trigger, Action, Delay, HTTP, and Condition nodes.

### 🟢 Step-by-Step Flow

1. **Trigger (Manual / Webhook)**
   - This is the starting point of the workflow.
   - The workflow begins when the trigger is manually started or invoked via webhook.
   - Trigger nodes do not allow incoming connections.

2. **Email Action**
   - Sends an initial email/message when the workflow starts.
   - Configured using a simple form with a message field.

3. **Delay Action**
   - Pauses the workflow execution for a specified duration (in seconds).
   - Useful for waiting before the next step.

4. **HTTP Request Action**
   - Makes an API call (GET / POST / PUT).
   - Response data (status, body, headers) is stored in execution context.
   - This result is used by the next condition node.

5. **Condition (Logic Node)**
   - Evaluates a condition based on the previous HTTP response.
   - Example:
     - `status === 200`
   - Has **two mandatory branches**:
     - ✅ **TRUE** (green edge)
     - ❌ **FALSE** (red edge)

6. **Success Email (TRUE branch)**
   - Executes only if the condition result is true.
   - Sends a success notification.

7. **Error Email (FALSE branch)**
   - Executes only if the condition result is false.
   - Sends an error/alert message to support.

---

## 🔗 Edge & Connection Rules

- Only **source → target** connections are allowed
- Outgoing → outgoing connections are blocked
- Condition node must have:
  - One incoming edge
  - Two outgoing edges (`true` and `false`)
- Edge colors:
  - Green → TRUE branch
  - Red → FALSE branch

---

## ▶ Execution Controls

- **Run** – Executes the full workflow from start to end
- **Pause** – Pauses execution mid-flow
- **Resume** – Continues execution from paused state
- **Step** – Executes one node at a time (step-by-step debugging)

During execution:
- Active node is highlighted
- Node status updates:
  - `running`
  - `success`
  - `error`
  - `skipped`

---

## ⏪ Undo / Redo

- Every change (node add, move, connect, delete) creates a snapshot
- **Undo (Ctrl + Z)** restores previous state
- **Redo (Ctrl + Shift + Z)** reapplies reverted changes
- Snapshot includes:
  - Nodes
  - Edges
  - Viewport position

---

## 💾 Save & Load

- Workflow can be saved to `localStorage`
- Autosave runs automatically (debounced)
- Validation runs before save
- Invalid workflows are not saved

---

## ✅ Validation Rules

Before saving or running:
- Workflow must be **acyclic**
- Trigger cannot have incoming edges
- Condition must have both TRUE and FALSE branches
- Typed port rules enforced

---

## 📦 Sample Workflow JSON

Two sample workflow JSON files are included for demonstration:
- Basic trigger → action flow
- Full trigger → delay → HTTP → condition → branching flow

These can be loaded to preview working examples.

---

## 🚀 Deployment

The application is deployed using **Vercel**.

Deployment Link: **(add your link here)**

---

## 🎥 Demo Video

A Loom recording demonstrates:
- Creating nodes
- Connecting edges
- Configuring forms
- Running, pausing, stepping through workflow

Loom Link: **(add your link here)**

---

## 🧠 Summary

This project demonstrates:
- Visual workflow builder
- Graph-based execution engine
- Undo/Redo system
- Validation & branching logic
- Clean and extensible architecture

Designed to be easily extended with new node types.
```
