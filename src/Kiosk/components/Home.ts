import {defineComponent, h, PropType} from "vue";
import Card from "./Card";
import {Category} from "../KioskOptions";

export default defineComponent({
    props: {
        categories: {type: Array as PropType<Category[]>, required: true}
    },
    emits: ["openCategory"],
    setup(props, {emit}) {
        const renderCategory = (category) => {
            let numberOfFiles = 0;

            if (category.type === "folders") {
                for (const folder of category.folders) {
                    numberOfFiles += folder.medias.length
                }
            } else {
                numberOfFiles += category.links.length
            }

            return h("div", {
                class: "flex justify-center"
            }, [
                h(Card, {
                    onClick: () => emit("openCategory", category),
                    icon: category.icon,
                    name: category.name,
                    color: category.color,
                    numberOfFiles
                })
            ])
        }

        return () => h("div", {
            class: "flex w-full p-10 flex flex-col"
        }, [
            h("div", {
                class: "w-full h-2/5"
            }, []),
            h("div", {
                class: "w-full h-3/5 justify-center flex flex-row flex-wrap gap-16"
            }, [
                props.categories.map((category) => renderCategory(category)),
            ])
        ])
    }
});