import {defineComponent, h, PropType} from "vue";
import {CategoryWithId} from "../Kiosk";
import NameIcon from "./NameIcon";
import Card from "./Card";

export type Folder = {
    name: string
    medias: []
}

export default defineComponent({
    props: {
        category: {type: Object as PropType<CategoryWithId>, required: true}
    },
    setup(props) {
        const {computed} = window.kiosk.vue;
        const {t} = window.kiosk;

        const renderFolder = (folder: Folder) => {
            return h(Card, {
                name: folder.name,
                numberOfFiles: folder.medias.length
            })
        }

        const folders = computed(() => {
            return props.category.folders ?? props.category.links ?? [];
        })

        return () => h("div", {
            class: "w-full h-full flex pl-8 pt-4 space-y-6"
        }, [
            h("div", {
                class: "flex flex-col w-full space-y-8"
            }, [
                h(NameIcon, {
                    color: props.category.color,
                    name: props.category.name,
                    icon: props.category.icon,
                    iconStyle: `text-3xl text-${props.category.color}-500`,
                    textStyle: `text-2xl text-${props.category.color}-500 font-bold`
                }),
                h("span", {
                    class: "font-semibold text-3xl text-gray-700"
                }, t('modules.kiosk.options.view.select_folder')),
                h("div", {
                    class: "w-full h-3/5 grid grid-cols-4 gap-4"
                }, [
                    folders.value.map((folder) => renderFolder(folder))
                ])
            ]),
        ])
    }
});