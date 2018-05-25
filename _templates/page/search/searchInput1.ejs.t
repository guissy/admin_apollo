---
to: src/pages/<%= h.folder(name) %>.field.tsx
inject: true
skip-if: \\'form\\'
before: <% file=`src/pages/${h.folder(name)}.field.tsx`; h.searchProps(file) -%>
---