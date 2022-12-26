import { VStack, Image, Center, Text, Heading, ScrollView } from "native-base";
import {useForm, Controller} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useAuth } from "@hooks/useAuth";
import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";

type formValidProps = {
    email: string;
    password: string;
}

const signInSchema = yup.object({
    email: yup.string().required('Informe o e-mail'),
    password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos')
})
export function Signin(){
    const { signIn } = useAuth()

    const {control, handleSubmit, formState: {errors}} = useForm<formValidProps>({
        resolver: yupResolver(signInSchema)
    });
    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    function handleNewAccount(){
        navigation.navigate('signUp');
    }

    async function handleValidAccount({email, password} : formValidProps){
        await signIn(email, password)
    };
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
                Acessar conta
            </Heading>

            <Controller
            control={control}
            name='email'
            render={({field: {onChange, value}}) => (
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
            render={({field: {onChange, value}}) => (
                <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}/>
            )}/>



             <Button title='Acessar'
             onPress={handleSubmit(handleValidAccount)}/>
            </Center>

            <Center>
            <Text color='gray.100' mt={24} mb={3} fontSize='sm' fontFamily='body'>
                Ainda não tem acesso
            </Text>
            <Button
            title='Criar conta'
            variant={"outline"}
            onPress={handleNewAccount}
            />

            </Center>

        </VStack>
        </ScrollView>

    );
}