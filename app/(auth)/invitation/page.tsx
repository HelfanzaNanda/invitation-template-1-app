"use client"

import Breadcrumbs from '@/components/Breadcrumbs';
import SectionForm from '@/components/SectionForm';
import { useSection } from '@/hooks/useSection';
import { auth } from '@/middlewares/auth.middleware';
import { Section, SectionChild, SectionField } from '@/types/section.type';
import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Collapse, Form, Switch } from 'antd';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';
import React from 'react'

const Invitation = () => {

    auth();

    const [sections, setSections] = React.useState<Section[]>([]);
    const { getAll } = useSection({ });

    const [form] = Form.useForm();

    React.useEffect(() => {
        (async () => {
            const data = await getAll();
            setDataAndForm(data!!);
        })()
    }, []);


    const setDataAndForm = (data : Section[]) => {
        setSections(data);
        form.setFieldsValue({
            'sections' : data
        })
    }


    const addNewFields = (section : Section, sectionField : SectionField) => {


        // const newSections = sections;
        // const findSection = newSection.find(sec => sec.id == section.id);
        // if (findSection) {
        //     const findSectionField = findSection.fields?.find(field => field.field == sectionField.field);
        //     if (findSectionField) {
        //         const newObject : SectionChild = sectionField.children[0];
        //         findSectionField.children.push(newObject);
        //         setDataAndForm(newSection);
        //     }
        // }

        const newSections = sections.map(sec => {
            if (sec.id == section.id) {
                sec.fields?.map(f => {
                    if (f.field == sectionField.field) {
                        f.children.push(sectionField.children[0]);
                    }
                    return f;
                })
            }
            return sec;
        })

        setDataAndForm(newSections);

        console.log('newSection : ', newSections);
        console.log('sections : ', sections);
        

        // const newObject : SectionChild = section.children[0];

        // setItems(prev => {
        //     const is = prev;
        //     const item = is.find(i => i.field == section.field);
        //     if (item) {
        //         item.children.push(newObject);
        //     }
        //     return is;
        // });

        // console.log('section : ', section);
        // console.log('sectionField : ', sectionField);
        // console.log('title : ', title);
        
    }

    return (
        <main>
            <Breadcrumbs items={[{label : 'Dashboard', to : '/dashboard'}]} />
            {/* <p>{JSON.stringify(data)}</p> */}
            <div className='flex justify-center'>
                <div className='bg-white p-3 rounded-md w-11/12'>
                    <p className='mb-3 text-lg font-semibold'>Form Section</p>
                        <Form
                            form={form}
                            layout='vertical'
                            autoComplete="off">
                            <Form.List name="sections">
                                {(fields, { add, remove }) => {
                                    // console.log('fields : ', fields);
                                    
                                    return (
                                        <>
                                        {fields.map(({ key, name, ...restField }) => {
                                            
                                            const section = sections.at(key);
                                            // console.log('section : ', section);
                                            return (
                                                <Collapse key={key} ghost       
                                                    expandIcon={({ isActive }) => (
                                                        <Switch size={'small'} checked={isActive} />
                                                    )}>
                                                    <CollapsePanel header={section?.title} key={key}>
                                                        <SectionForm addNewFields={addNewFields} section={section!!} />
                                                    </CollapsePanel>
                                                </Collapse>
                                            )
                                        })}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Save
                                            </Button>
                                        </Form.Item>
                                        </>
                                    )
                                }}
                            </Form.List>
                        </Form>
                </div>

            </div>
            

        </main>
    )
}

export default Invitation;
