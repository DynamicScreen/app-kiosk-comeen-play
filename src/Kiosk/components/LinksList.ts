import {defineComponent, PropType, h} from "vue";
import {Link} from "../KioskOptions";
import LinkItem from "./LinkItem";

export default defineComponent({
    props: {
        links: {type: Array as PropType<Link[]>, required: true}
    },
    setup(props, {emit}) {
        const {t} = window.kiosk

        return () => h("div", {
            class: "w-full h-full pt-12"
        }, [
            h("div", {
                class: "w-3/4 h-full flex flex-col overflow-y-scroll"
            }, [
                h("div", {
                    class: "flex flex-row space-x-3 items-center pb-6"
                }, [
                    h("span", {
                        class: "font-semibold text-3xl text-gray-600"
                    }, t('modules.kiosk.options.view.select_link'))
                ]),
                props.links.map((link: Link) => h(LinkItem, {link}))
            ]),
        ])
    }
});