---
to: src/pages/<%= h.folder(name) %>.field.tsx
inject: true
skip-if: detail
after: <%- `<TableActionComponent>` %>
---
                    <LinkComponent
                      onClick={() => {
                        this.setState({
                          detail: { visible: true, record }
                        });
                      }}
                    >
                      {site('详情')}
                    </LinkComponent>