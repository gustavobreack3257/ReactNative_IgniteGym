import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";

import { Controller, useForm } from "react-hook-form";
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast} from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks/useAuth";
import * as yup from "yup";


const PHOTO_SIZE = 33;

type formDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    password: yup.string().min(6, 'A senha deve ter 6 dígitos.').nullable().transform((value) => !!value  ? value : null),
    confirm_password: yup.string().nullable().transform((value) => !!value  ? value : null).oneOf([yup.ref('password'), null], 'A confirmação de senha não confere')
})
export function Profile(){
    const [photoIsLoading, setPhotoIsLoading] = useState(false)
    const [userPhoto, setUserPhoto] = useState('https://github.com/gustavobreack3257.png')

    const toast = useToast();
    const { user } = useAuth()
    const { control, handleSubmit, formState: {errors} } = useForm<formDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema)
    });

    async function handleUserPhotoSelect(){
        setPhotoIsLoading(true)
        try{
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });

            if(photoSelected.canceled){
                return;
            }

            const [image] = photoSelected.assets;

            if(image.uri){
                const photoInfo = await FileSystem.getInfoAsync(image.uri);

                if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 3){
                    return toast.show({
                        title:'Essa imagem é muito grande. Escolha uma de até 3MB',
                        placement: 'top',
                        bgColor: 'red.400'
                    })

                }

                setUserPhoto(image.uri);
            }


        } catch(error){
            console.log(error)
        } finally{
            setPhotoIsLoading(false)
        }

    }

    async function handleProfileUpdate(data: formDataProps) {
        console.log(data);
    }

    return(
        <VStack flex={1}>
            <ScreenHeader title='Perfil'/>
            <ScrollView contentContainerStyle={{paddingBottom: 36}}>
                <Center mt={6} px={10}>
            {
                photoIsLoading  ?
                <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded='full'
                startColor='gray.500'
                endColor='gray.400'/>
                :
                <UserPhoto
                source={{uri: userPhoto}}
                alt='Foto do usuário'
                size={PHOTO_SIZE}

                />
            }

                <TouchableOpacity onPress={handleUserPhotoSelect}>
                    <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8}>
                        Alterar Foto
                    </Text>
                </TouchableOpacity>

                <Controller
                control={control}
                name='name'
                render={({ field: {value, onChange}}) => (
                <Input
                bg='gray.600'
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage= {errors.name?.message}/>
                )}/>

                <Controller
                control={control}
                name='email'
                render={({ field: {value, onChange}}) => (
                    <Input
                    bg='gray.600'
                    placeholder="E-mail"
                    isDisabled
                    onChangeText={onChange}
                    value={value}/>
                )}/>


                <Heading color='gray.200' fontFamily='heading' fontSize='md' mb={2} alignSelf='flex-start' mt={12} >
                    Alterar senha
                </Heading>

                <Controller
                control={control}
                name='old_password'
                render={({ field: {onChange}}) => (
                    <Input
                    bg='gray.600'
                    placeholder="Senha antiga"
                    secureTextEntry
                    onChangeText={onChange}/>
                )}/>

                <Controller
                control={control}
                name='password'
                render={({ field: {onChange}}) => (
                    <Input
                    bg='gray.600'
                    placeholder="Nova senha"
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}/>

                )}/>

                <Controller
                control={control}
                name='confirm_password'
                render={({ field: {onChange}}) => (
                    <Input
                    bg='gray.600'
                    placeholder="Confirme a nova senha"
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.confirm_password?.message}/>

                )}/>

                <Button
                    title='Atualizar'
                    mt={4}
                    onPress={handleSubmit(handleProfileUpdate)}/>
                </Center>
            </ScrollView>
        </VStack>
    )
}