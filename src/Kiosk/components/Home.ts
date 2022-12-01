import {defineComponent, h, PropType} from "vue";
import Card from "./Card";
import {Category} from "../KioskOptions";
import moment from "moment";

export function countNewFiles(medias: Partial<{updated_at: string}>[], daysConsideredNew: number): number {
    let newFiles = 0;
    const now = moment().subtract(49, "days");
    for (const media of medias) {
        const mediaWhen = moment(media.updated_at);
        if (now.diff(mediaWhen, "days") < daysConsideredNew) {
            newFiles += 1;
        }
    }
    return newFiles;
}

export default defineComponent({
    props: {
        categories: {type: Array as PropType<Category[]>, required: true}
    },
    emits: ["openCategory"],
    setup(props, {emit}) {
        const {notification_duration} = window.kiosk

        const renderCategory = (category) => {
            let numberOfFiles = 0;
            let newFiles = 0;
            if (category.type === "folders") {
                for (const folder of category.folders) {
                    newFiles += countNewFiles(folder.medias, notification_duration);
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
                    newFiles,
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