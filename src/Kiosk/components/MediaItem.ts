import {defineComponent, h, Suspense, toDisplayString} from "vue";
import PreviewImageModal from "./PreviewImageModal";
import PreviewVideoModal from "./PreviewVideoModal";

const loadMedia = (url: string) => {
    return new Promise(async (resolve, reject) => {
        const context = window.kiosk.context;
        const ability = await context.assetsStorage();
        const asset = await ability.getDisplayableAsset(url);
        // setTimeout(() => {
        //     resolve(asset.displayableUrl());
        // }, 5000 * 10000)
        resolve(asset.displayableUrl());
    })

}

export default defineComponent({
    props: {
        url: {type: String, required: true},
        name: {type: String, required: true},
        isImage: {type: Boolean, required: true}
    },
    async setup(props) {
        const {ref, toRef} = window.kiosk.vue;
        const {context} = window.kiosk
        const isImage = toRef(props, "isImage");
        const displayableUrl = ref(await loadMedia(props.url));

        const previewMedia = () => {
            if (isImage.value) {
                context.modal.showModal(PreviewImageModal, {urlToDisplay: displayableUrl})
            } else {
                context.modal.showModal(PreviewVideoModal, {urlToDisplay: displayableUrl})
            }
        }

        return () => h("div", {
            onClick: () => previewMedia(),
            class: "w-full h-16 flex flex-row items-center space-x-3 cursor-pointer"
        }, [
            isImage.value ? h("img", {
                class: "w-10 h-10 rounded-lg",
                src: displayableUrl.value
            }) : h("div", {
                class: "w-10 h-10 bg-gray-200 flex items-center justify-center rounded-lg"
            }, h("i", {
                  class: "fa-solid fa-video text-gray-700"
            })),
            h("div", {
                class: "w-full border-b border-gray-200 flex justify-between items-end"
            }, [
                h("span", {
                    class: "text text-gray-500 mb-2"
                }, props.name),
                h("span", {
                    class: "text-xs text-gray-400"
                }, "Il y a 20 heures")
            ])
        ])
    }
})