import { VStack, Image, Center, Text, Heading, ScrollView } from "native-base";

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
export function Signin(){
    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    function handleNewAccount(){
        navigation.navigate('signUp');
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
                Acesso a conta
            </Heading>

            <Input
             placeholder="E-mail"
             keyboardType="email-address"
             autoCapitalize="none"/>

            <Input
             placeholder="Senha"
             secureTextEntry/>

             <Button title='Acessar'/>
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