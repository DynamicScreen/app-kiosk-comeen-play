import { defineComponent, h } from "vue";

export default defineComponent({
  props: {
    urlToDisplay: { type: String, required: true },
    name: { type: String, required: true },
    page: { type: Number, required: true }
  },
  setup(props, { emit }) {
    const { ref, onMounted, toRef } = window.kiosk.vue
    const { context } = window.kiosk

    const pdfSrc = toRef(props, "urlToDisplay")

    const scale = ref(2)

    const { pdf, pages } = context.pdf.usePDF(pdfSrc.value)

    return () => h(context.modal.ModalBody, null, {
      title: () => h("div", [
        h("div", { class: "flex flex-row" }, [
          h("p", props.name),
          h("div", { class: "flex-grow" }),
          h('i', { class: ['fas fa-xmark text-2xl'], onClick: () => emit("result", {}) }),
        ]),
        h("div", { class: 'flex flex-row text-4xl justify-center' }, [
          h('i', { class: ['far fa-magnifying-glass-minus mr-4'], onClick: () => scale.value = scale.value > 0.5 ? scale.value - 0.5 : 0.5 }),
          h('i', { class: ['far fa-magnifying-glass-plus'], onClick: () => scale.value = scale.value < 3 ? scale.value + 0.5 : 3 })
        ]),
      ]),
      default: () => [
        ...Array.from(Array(pages.value).keys()).map(page => {
          return h(context.pdf.VuePDF, {
            pdf: pdf.value,
            page: page + 1,
            scale: scale.value
          })

        })
      ]
    })
  }
});
