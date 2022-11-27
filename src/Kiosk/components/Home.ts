import {defineComponent, h} from "vue";
import Card from "./Card";

export default defineComponent({
    props: {
        categories: {type: Array, required: true}
    },
    emits: ["update:openCategory"],
    setup(props, {emit}) {
        const renderCategory = (category) => {
            let numberOfFiles = 0;
            for (const folder of category.folders) {
                numberOfFiles += folder.medias.length
            }

            return h(Card, {
                onClick: () => emit("update:openCategory", category),
                icon: category.icon,
                name: category.name,
                color: category.color,
                numberOfFiles
            })
        }

        return () => h("div", {
            class: "flex w-full p-10 flex flex-col"
        }, [
            h("div", {
                class: "w-full h-2/5"
            }, []),
            h("div", {
                class: "w-full h-3/5 flex flex-row justify-around grid-rows-4"
            }, [
                props.categories.map((category) => renderCategory(category))
            ])
        ])
    }
});