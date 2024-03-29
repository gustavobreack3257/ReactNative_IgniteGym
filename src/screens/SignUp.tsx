import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from "native-base";
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { AppError } from "@utils/AppError";
import { api } from '@services/Api'
import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o email').email("E-mail invalido"),
    password: yup.string().required('Informe a senha.').min(6, 'A senha deve possuir pelo menos 6 dígitos'),
    password_confirm: yup.string().required('Confirme a senha').oneOf([yup.ref('password'), null], ' A confirmação da senha não confere.')
})
export function SignUp(){

    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();
    const { signIn } = useAuth();

    const {control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });
    const navigation = useNavigation();

    function handleGoBack(){
        navigation.goBack();
    }

    async function handleShow({name, email, password} : FormDataProps){
        try{
            setIsLoading(true);

            await api.post('/users', {name, email, password});
            await signIn(email, password);

        } catch(error){
            setIsLoading(false)

            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível criar a conta, tente novamente mais tarde.'

            toast.show({
                title,
                placement: 'top',
                bg: 'red.500'
            })
        }

        /*
        const response = await fetch('http://192.168.0.108:3333/users', {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email, password})
        });
        const data = await response.json();
        console.log(data);
        */
    }
    return(
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
         <VStack flex={1}  px={10}>
            <Image
            source={BackgroundImg}
            defaultSource={BackgroundImg}
            alt='Pessoas treinando'
            resizeMode="contain"
            position='absolute'
            />
            <Center my={24}>
                <LogoSvg/>

                <Text color='gray.100' fontSize='sm'>
                    Treine seu corpo e sua mente
                </Text>
            </Center>
            <Center>
            <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading' >
                Crie sua conta
            </Heading>

            <Controller
            control={control}
            name='name'
            render={({ field: {onChange, value}}) => (
                <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}

             />
            )}/>

            <Controller
            control={control}
            name='email'
            render={({ field: {onChange, value}}) => (
                <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
                />
            )}/>



            <Controller
            control={control}
            name='password'
            render={({ field: {onChange, value}}) => (
                <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}/>
            )}/>

            <Controller
            control={control}
            name='password_confirm'
            render={({ field: {onChange, value}}) => (
                <Input
                placeholder="Confirme a senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleShow)}
                returnKeyType='send'
                errorMessage={errors.password_confirm?.message}/>
            )}/>


             <Button title='Criar e acessar'
             onPress={handleSubmit(handleShow)}
             isLoading={isLoading}/>
            </Center>

            <Button
            title='Voltar e acessar'
            variant={"outline"}
            mt={12}
            onPress={handleGoBack}/>

        </VStack>
        </ScrollView>

    );
}