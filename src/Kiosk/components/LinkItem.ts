import {defineComponent, h, PropType} from "vue";
import {Link} from "../KioskOptions";
import PreviewLinkModal from "./PreviewLinkModal";

export default defineComponent({
    props: {
        link: {type: Object as PropType<Link>, required: true}
    },
    setup(props, {emit}) {
        //@ts-ignore
        const {context} = window.kiosk

        const previewLink = () => {
            context.modal.showModal(PreviewLinkModal, {url: props.link.url, name: props.link.name})
        }

        return () => h("div", {
            onClick: () => previewLink(),
            class: "w-full h-16 flex flex-row items-center space-x-3 cursor-pointer"
        }, [
            h("div", {
                class: "w-10 h-10 bg-gray-200 flex items-center justify-center rounded-lg"
            }, h("i", {
                class: `text-gray-700 ${props.link.icon}`
            })),
            h("div", {
                class: "w-full border-b border-gray-200 flex items-center space-x-5"
            }, [
                h("span", {
                    class: "font-semibold text-gray-600"
                }, props.link.name),
                h("span", {
                    class: "text-gray-500"
                }, props.link.url)
            ])
        ])
    }
});
