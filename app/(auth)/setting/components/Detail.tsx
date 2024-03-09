import { useMedia } from "@/hooks/useMedia";
import { useSetting } from "@/hooks/useSetting";
import { Setting } from "@/types/setting.type";
import { EditOutlined, InstagramOutlined } from "@ant-design/icons";
import { Button, DatePicker, Descriptions, DescriptionsProps, Form, Image, Input, Modal, UploadFile } from "antd";
import Upload, { RcFile } from "antd/es/upload";
import dayjs from "dayjs";
import React from "react";
import { UploadRequestOption } from 'rc-upload/lib/interface';


interface Props {
    title : string;
    data : Setting;
    mutate : () => void;

}

const Detail : React.FC<Props> = ( { title, data, mutate } ) => {

    const [modal, setModal] = React.useState<boolean>(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);

    const [audio, setAudio] = React.useState( typeof Audio !== "undefined" && new Audio("your-url.mp3"));
    const [isPlaying, setIsPlaying] = React.useState(false);

    const { get, set } = useSetting();
    const { upload, download } = useMedia();

    React.useEffect(() => {
        setAudio(new Audio(data.song?.fileurl))
    }, [data])


    const handleAudio = () => {
        if (isPlaying) {
            setIsPlaying(false);
            audio.pause();
        }else{
            setIsPlaying(true);
            audio.play();
        }
    }

    


    const handleCancel = () => {
        setFileList([]);
        form.resetFields();
        setModal(false);
    }

    
    const handleEdit = async () => {
        const data = await get();
        if (data?.id) {
            const file = await download(data.song?.uuid!!, data.song?.originalName!!);
            const uploadedFile : UploadFile = {
                uid : data.song?.uuid!!,
                name : data.song?.originalName!!,
                originFileObj : file as RcFile
            };
            setFileList([uploadedFile]);

            const item = {
                id : data.id,
                captionFooter : data.captionFooter,
                date : dayjs(data.date),
                mediaUuid : data.song?.uuid,
                file : data.song
            }
            form.setFieldsValue(item);
            setModal(true);
        }
    }


    const handleSubmit = async () => {
        const fields = await form.validateFields();
        const params = {
            captionFooter : fields.captionFooter,
            date : dayjs(data.date).format('YYYY-MM-DD'),
            songUuid : form.getFieldValue("mediaUuid"),

        }
        await set(params);
        mutate();
        handleCancel();
    }

    const handleChangeFile = async (opt : UploadRequestOption) => {
        const data = await upload(opt.file as File);
        if (data?.uuid) {
            setFileList([opt.file as UploadFile]);   
            form.setFieldsValue({
                "mediaUuid" : data.uuid
            });
        }
    };


    return (
        <>
            <div className='bg-white p-3 rounded-md shadow-md'>
                <div className="flex justify-between">
                    <div className='text-lg mb-5 font-semibold'>{title}</div>
                    <Button onClick={() => handleEdit()} type="primary" shape="circle" icon={<EditOutlined/>} />
                </div>
                <div className="grid grid-cols-5 space-x-3">
                    <div>
                        <label htmlFor="" className="text-gray-500">Date</label>
                        <p>{data.date}</p>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="" className="text-gray-500 inline-block">Song</label>
                        <div className="flex items-center space-x-2">
                            <Button className="w-8" shape="circle" type="primary" onClick={() => handleAudio() }>{isPlaying ? 'Stop' : 'Play'}</Button>
                            <p className="text-wrap break-words">{data.song?.originalName}</p>
                        </div>
                    </div>
                    <div className="col-span-3">
                        <label htmlFor="" className="text-gray-500">Footer Caption</label>
                        <p>{data.captionFooter}</p>
                    </div>
                </div>
            </div>

            <Modal
                title={<span className='uppercase'>Edit Setting</span>}
                open={modal}
                onCancel={() => handleCancel()}
                footer={
                    <>
                        <Button key={"cancel"} onClick={() => handleCancel()}>Cancel</Button>
                        <Button key={"submit"} type='primary' onClick={() => handleSubmit()}>Submit</Button>
                    </>
                }
                >
                <Form
                    form={form}
                    layout='vertical'>
                    <Form.Item label={"Date"} name={'date'} rules={[{ required : true, message : "field is required" }]}>
                        <DatePicker picker="date" className="w-full" />
                    </Form.Item>
                    <Form.Item label={"Caption"} name={'captionFooter'} rules={[{ required : true, message : "field is required" }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label={"Song"} name={'file'} rules={[{ required : true, message : "field is required" }]}>
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            customRequest={(option) => handleChangeFile(option)}
                            rootClassName='w-full'
                            onRemove={(file) => setFileList([])}>
                            {fileList.length < 1 && (
                                <div className='w-full inline-block border rounded-md cursor-pointer py-1 px-3'>Choose Your Song</div>
                            )}
                        </Upload>
                    </Form.Item>
                    

                </Form>
            </Modal>
        </>
    )
}

export default Detail;