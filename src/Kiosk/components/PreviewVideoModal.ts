import {defineComponent, h} from "vue";

export default defineComponent({
    props: {
        urlToDisplay: {type: String, required: true}
    },
    setup(props, {emit}) {
        const {context} = window.kiosk;
        const {ref} = window.kiosk.vue;

        const videoPlayer = ref(null);

        context.videoPlayback().then(async (ability) => {
            videoPlayer.value = await ability.createVideoPlayer(props.urlToDisplay);
            videoPlayer.value.setBoundaries(document.getElementById("video-container-kiosk"));
            await videoPlayer.value.prepare();
            videoPlayer.value.player.controls = "controls";
            videoPlayer.value.setVolume(20);
            await videoPlayer.value.play();
        })

        return () => h(context.modal.ModalBody, null, {
            default: () => [
                h("div", {
                class: "flex justify-center items-center w-3/4 h-3/4"
            }, [
                h("div", {
                    id: "video-container-kiosk",
                    ref: "videoContainer",
                    class: "w-full h-full"
                })
            ]),
                h("div", {
                    class: "w-full"
                })
            ]
        })
    }
});