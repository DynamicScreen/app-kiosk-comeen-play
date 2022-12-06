import { defineComponent, h } from "vue";

export default defineComponent({
  props: {
    urlToDisplay: { type: String, required: true },
    name: { type: String, required: true },
  },
  setup(props, { emit }) {
    const { context } = window.kiosk

    return () => h(context.modal.ModalBody, null, {
      title: () => h("div", { class: "flex flex-row" }, [
        h("p", props.name),
        h("div", { class: "flex-grow" }),
        h('i', { class: ['fas fa-xmark text-2xl'], onClick: () => emit("result", {}) }),
      ]),
      default: () => h("img", {
        src: props.urlToDisplay,
        class: "h-full w-full object-contain"
      })
    })
  }
});
