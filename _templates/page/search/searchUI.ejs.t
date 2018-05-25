---
to: src/pages/<%= h.folder(name) %>.page.tsx
inject: true
after: <%- `<>` %>
skip_if: <%- `<SearchUI` %>
---
        <SearchUI
          fieldConfig={searchFields}
          onSubmit={(values: { pathBuilder: (o: object) => string }) => {
            const searchValues = {
              ...values,
              page: 1,
              page_size: 20
            };
            this.setState({ searchValues });
            return this.refetch(searchValues);
          }}
        />