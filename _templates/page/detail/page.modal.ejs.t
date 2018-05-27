---
to: src/pages/<%= h.folder(name) %>.page.tsx
inject: true
before: <%- `<AgentAccountEdit` %>
skip_if: <%- `详情` %>
---
<% Page = h.Page(name); page = h.page(name); dd = h.dd(name); -%>
        <Modal
          visible={this.state.detail.visible}
          title={site('详情')}
          onCancel={() => {
            this.setState({
              detail: { visible: false }
            });
          }}
          footer={
            <Button
              onClick={() => {
                this.setState({ detail: { visible: false } });
              }}
            >
              关闭
            </Button>
          }
        >
          <div>{detailFields}</div>
        </Modal>