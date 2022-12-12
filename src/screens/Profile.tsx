import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";

import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast} from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";

const PHOTO_SIZE = 33
export function Profile(){
    const [photoIsLoading, setPhotoIsLoading] = useState(false)
    const [userPhoto, setUserPhoto] = useState('https://github.com/gustavobreack3257.png')

    const toast = useToast();

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

                <Input
                bg='gray.600'
                placeholder="Nome"/>

                <Input
                bg='gray.600'
                value="gustavocostasouza78@gmail.com"
                isDisabled/>

                <Heading color='gray.200' fontSize='md' mb={2} alignSelf='flex-start' mt={12} >
                    Alterar senha
                </Heading>

                <Input
                    bg='gray.600'
                    placeholder="Senha antiga"
                    secureTextEntry/>

                <Input
                    bg='gray.600'
                    placeholder="Nova senha"
                    secureTextEntry/>

                <Input
                    bg='gray.600'
                    placeholder="Confirme a nova senha"
                    secureTextEntry/>

                <Button
                    title='Atualizar'
                    mt={4}/>
                </Center>
            </ScrollView>
        </VStack>
    )
}